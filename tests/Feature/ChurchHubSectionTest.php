<?php

namespace Tests\Feature;

use App\Core\PageBuilder\BlockRegistry;
use App\Enums\UserRole;
use App\Models\SitePage;
use App\Models\Tenant;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ChurchHubSectionTest extends TestCase
{
    use RefreshDatabase;

    private function payload(SitePage $page, array $data): array
    {
        return [
            'template' => 'template-pop-balance', 'activePageId' => (string) $page->id,
            'pages' => [[
                'id' => (string) $page->id, 'label' => 'Home', 'path' => '/',
                'version' => $page->builder_version ?: 1,
                'blocks' => [[
                    'id' => 'church-hub-test', 'type' => 'church-hub',
                    'navEnabled' => false, 'navLabel' => 'Layanan Gereja', 'data' => $data,
                ]],
            ]],
        ];
    }

    public function test_defaults_customization_duplication_and_empty_lists_persist(): void
    {
        $this->seed();
        $admin = User::factory()->create(['role' => UserRole::ADMIN]);
        $page = SitePage::query()->where('slug', 'home')->firstOrFail();
        $defaults = BlockRegistry::definitions()['church-hub']['defaults'];
        $this->assertCount(6, $defaults['services']);
        $this->assertCount(3, $defaults['news']);
        $this->actingAs($admin)->get(route('admin.pages.index'))->assertOk()->assertSee('church-hub');
        $this->postJson(route('admin.pages.builder.site-save'), $this->payload($page, $defaults))->assertOk();
        // Empty links normalize to null through existing Laravel middleware.
        $saved = $page->fresh()->blocks()->firstOrFail()->data_json;
        $this->assertSame(array_column($defaults['services'], 'title'), array_column($saved['services'], 'title'));
        $this->assertSame(array_column($defaults['news'], 'date'), array_column($saved['news'], 'date'));
        $saved['services'][0]['title'] = 'Ibadah Keluarga';
        $saved['services'][0]['description'] = 'Minggu pukul 08.00 bersama keluarga.';
        $saved['services'][0]['icon'] = 'bi-house-heart';
        $saved['services'][0]['link'] = 'https://example.com/ibadah';
        $saved['services'][1]['enabled'] = '0';
        $saved['services'] = array_reverse($saved['services']);
        $saved['news'][0]['category'] = 'Kegiatan';
        $saved['news'][0]['title'] = 'Ibadah Syukur';
        $saved['news'][0]['description'] = 'Bersyukur bersama jemaat.';
        $saved['news'][0]['date'] = '2026-11-01';
        $saved['news'][0]['link'] = 'https://example.com/syukur';
        array_pop($saved['news']);
        $saved['news'][] = array_replace($saved['news'][0], ['title' => 'Kabar Jemaat']);
        $payload = $this->payload($page->fresh(), $saved);
        $clone = $payload['pages'][0]['blocks'][0];
        $clone['id'] = 'church-hub-copy';
        $clone['data']['servicesTitle'] = 'Panel salinan';
        $payload['pages'][0]['blocks'][] = $clone;
        $this->postJson(route('admin.pages.builder.site-save'), $payload)->assertOk();
        $blocks = $page->fresh()->blocks()->get();
        $this->assertSame($saved, $blocks[0]->data_json);
        $this->assertSame('Panel salinan', $blocks[1]->data_json['servicesTitle']);
        $this->get(route('admin.pages.index'))->assertOk()->assertSee('Ibadah Keluarga')->assertSee('2026-11-01');
        $this->assertSame($defaults, BlockRegistry::definitions()['church-hub']['defaults']);

        $saved['services'] = [];
        $saved['news'] = [];
        $this->postJson(route('admin.pages.builder.site-save'), $this->payload($page->fresh(), $saved))->assertOk();
        $this->assertSame([], $page->fresh()->blocks()->firstOrFail()->data_json['services']);
        $this->assertSame([], $page->fresh()->blocks()->firstOrFail()->data_json['news']);
    }

    public function test_two_churches_keep_independent_content_and_global_defaults(): void
    {
        $this->seed();
        $owner = User::factory()->create(['role' => UserRole::USER]);
        $defaults = BlockRegistry::definitions()['church-hub']['defaults'];
        $pages = [];
        foreach (['hub-a', 'hub-b'] as $slug) {
            $tenant = Tenant::query()->create(['slug' => $slug, 'name' => $slug, 'status' => 'active']);
            $owner->memberships()->create(['tenant_id' => $tenant->id, 'role' => UserRole::SUPER_ADMIN, 'status' => 'active']);
            $page = SitePage::query()->withoutGlobalScopes()->create([
                'tenant_id' => $tenant->id, 'slug' => 'home', 'name' => 'Home', 'is_published' => true,
                'display_mode' => 'sections', 'builder_version' => 1,
            ]);
            $pages[$slug] = $page;
            $this->actingAs($owner)->withSession(['novabase.active_tenant_slug' => $slug])
                ->postJson(route('tenant.admin.pages.builder.site-save', ['tenant' => $slug]), $this->payload($page, $defaults))
                ->assertOk();
        }
        $changed = $defaults;
        $changed['servicesTitle'] = 'Layanan khusus gereja A';
        $changed['services'][0]['title'] = 'Ibadah Gereja A';
        $pageA = SitePage::query()->withoutGlobalScopes()->findOrFail($pages['hub-a']->id);
        $this->withSession(['novabase.active_tenant_slug' => 'hub-a'])
            ->postJson(route('tenant.admin.pages.builder.site-save', ['tenant' => 'hub-a']), $this->payload($pageA, $changed))
            ->assertOk();
        $pageB = SitePage::query()->withoutGlobalScopes()->findOrFail($pages['hub-b']->id);
        $this->assertSame('Layanan & Aktivitas Jemaat', $pageB->blocks()->firstOrFail()->data_json['servicesTitle']);
        $this->assertSame('Jadwal Ibadah', $pageB->blocks()->firstOrFail()->data_json['services'][0]['title']);
        $this->assertSame($defaults, BlockRegistry::definitions()['church-hub']['defaults']);
    }

    public function test_invalid_urls_and_unknown_item_fields_are_rejected(): void
    {
        $this->seed();
        $admin = User::factory()->create(['role' => UserRole::ADMIN]);
        $page = SitePage::query()->where('slug', 'home')->firstOrFail();
        $data = BlockRegistry::definitions()['church-hub']['defaults'];
        $data['services'][0]['link'] = 'javascript:alert(1)';
        $this->actingAs($admin)->postJson(route('admin.pages.builder.site-save'), $this->payload($page, $data))->assertStatus(422);
        $data['services'][0]['link'] = '';
        $data['news'][0]['unexpected'] = 'value';
        $this->postJson(route('admin.pages.builder.site-save'), $this->payload($page, $data))->assertStatus(422);
    }
}
