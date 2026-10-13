// Matches the registry fallback pattern; server defaults are authoritative when present.
export function churchHubDefaults() {
  if (globalThis.window?.NOVABASE_BLOCK_DEFINITIONS?.['church-hub']?.defaults) {
    return structuredClone(window.NOVABASE_BLOCK_DEFINITIONS['church-hub'].defaults);
  }
  return {
    servicesTitle: 'Layanan & Aktivitas Jemaat', newsTitle: 'Informasi & Kegiatan Gereja',
    services: [
      ['bi-clock', 'Jadwal Ibadah', 'Informasi jadwal dan waktu ibadah gereja.', 'Ibadah Minggu pukul 07.00 dan 10.00. Jadwal contoh dapat disesuaikan oleh admin gereja.'],
      ['bi-people', 'Persekutuan Pemuda', 'Informasi komunitas dan kegiatan pemuda.', 'Persekutuan pemuda setiap Sabtu pukul 17.00: pujian, firman, dan kebersamaan. Jadwal contoh dapat diedit.'],
      ['bi-balloon', 'Sekolah Minggu', 'Informasi pelayanan anak.', 'Pelayanan anak setiap Minggu pukul 09.00 dengan cerita firman, pujian, dan kegiatan kreatif. Jadwal contoh dapat diedit.'],
      ['bi-heart', 'Pelayanan Doa', 'Informasi dan akses permohonan doa.', 'Hubungi sekretariat gereja untuk menyampaikan permohonan doa secara pribadi. Admin dapat menambahkan tautan kanal pelayanan doa resmi.'],
      ['bi-book', 'Renungan Harian', 'Akses ke renungan dan refleksi firman Tuhan.', 'Luangkan waktu membaca firman dan berdoa bagi sesama. Admin dapat memperbarui renungan atau memasukkan tautan renungan gereja.'],
      ['bi-gift', 'Persembahan', 'Informasi mengenai persembahan dan dukungan pelayanan.', 'Hubungi sekretariat gereja untuk saluran persembahan resmi. Tidak ada rekening atau pembayaran contoh yang diaktifkan.'],
    ].map(([icon, title, description, details]) => ({ icon, title, description, details, link: '', enabled: '1' })),
    news: [
      ['Pengumuman', 'Jadwal Ibadah Minggu', 'Informasi jadwal ibadah dan rangkaian pelayanan minggu ini.', '2026-10-18', 'Baca selengkapnya', 'Ibadah Minggu pukul 07.00 dan 10.00, dilanjutkan persekutuan jemaat. Jadwal ini adalah contoh yang dapat diedit.'],
      ['Kegiatan', 'Persekutuan Pemuda', 'Mari bertumbuh bersama dalam iman, persekutuan, dan pelayanan.', '2026-10-17', 'Lihat kegiatan', 'Persekutuan pemuda Sabtu pukul 17.00 dengan pujian, refleksi firman, dan diskusi kelompok. Jadwal contoh dapat diedit.'],
      ['Informasi', 'Pelayanan Sosial Gereja', 'Informasi kegiatan pelayanan dan kepedulian gereja terhadap masyarakat.', '2026-10-24', 'Baca informasi', 'Jemaat diajak membantu paket kebutuhan pokok dan kunjungan kasih. Hubungi tim diakonia untuk partisipasi. Jadwal contoh dapat diedit.'],
    ].map(([category, title, description, date, actionLabel, details]) => ({ category, title, description, date, actionLabel, details, link: '', enabled: '1' })),
  };
}

// Fill absent fields only. Explicitly empty arrays/text and hidden items stay as saved.
export function churchHubData(source = {}) {
  const data = structuredClone(source || {});
  const defaults = churchHubDefaults();
  for (const key of Object.keys(defaults)) {
    if (!Object.hasOwn(data, key)) data[key] = structuredClone(defaults[key]);
  }
  return data;
}

function safeLink(value) {
  const link = String(value || '').trim();
  if (/^https?:\/\//i.test(link) || /^mailto:[^\s]+$/i.test(link) || /^tel:[+\d ()-]+$/i.test(link)
    || (!link.startsWith('//') && /^[A-Za-z0-9._~\/%?#=&+-]+$/.test(link))) return link;
  return '';
}

export function renderChurchHub(block, editable, escape) {
  const data = churchHubData(block.data);
  const edit = path => editable ? `contenteditable="true" data-edit="${escape(block.id)}:${path}"` : '';
  const dialogs = [];
  const open = (item, key, contents, className) => {
    const link = safeLink(item.link);
    if (link) return `<a class="${className}" href="${escape(link)}">${contents}</a>`;
    const titleId = `church-hub-${block.id}-${key}`;
    dialogs.push(`<dialog class="activity-dialog" data-activity-dialog="${key}" aria-labelledby="${escape(titleId)}">
      <div class="activity-dialog-header"><h3 id="${escape(titleId)}">${escape(item.title)}</h3>
      <button type="button" class="btn btn-outline-dark" data-activity-close aria-label="Tutup detail" autofocus>×</button></div>
      <div class="activity-description">${escape(item.details || item.description)}</div></dialog>`);
    return `<button type="button" class="${className}" data-activity-open="${key}" aria-haspopup="dialog">${contents}</button>`;
  };
  const visible = list => (Array.isArray(list) ? list : []).map((item, index) => ({item, index}))
    .filter(({item}) => item.enabled !== '0' && item.enabled !== false);
  const services = visible(data.services);
  const news = visible(data.news);
  const categoryClass = category => ({pengumuman: 'announcement', kegiatan: 'event', informasi: 'information'}[String(category || '').toLowerCase()] || 'other');
  const date = value => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value || '')) return escape(value || '');
    const parsed = new Date(`${value}T12:00:00`);
    return Number.isNaN(parsed.getTime()) ? escape(value) : escape(parsed.toLocaleDateString('id-ID', {day: 'numeric', month: 'long', year: 'numeric'}));
  };
  return `<div class="section-pad church-hub" data-activities>
    <div class="church-hub-layout">
      <section class="church-hub-panel" aria-label="Layanan jemaat">
        <div class="church-hub-panel-heading"><span class="church-hub-eyebrow">BERTUMBUH & MELAYANI</span>
        <h2 class="section-heading" ${edit('servicesTitle')}>${escape(data.servicesTitle)}</h2></div>
        <div class="church-hub-services">${services.map(({item, index}) => {
          const icon = /^bi-[a-z0-9-]+$/.test(item.icon || '') ? item.icon : 'bi-heart';
          return open(item, `service-${index}`, `<span class="church-hub-icon"><i class="bi ${escape(icon)}" aria-hidden="true"></i></span>
            <span class="church-hub-service-copy"><span class="church-hub-card-title">${escape(item.title)}</span><span class="church-hub-description">${escape(item.description)}</span></span>
            <i class="bi bi-arrow-up-right church-hub-arrow" aria-hidden="true"></i>`, 'church-hub-service');
        }).join('')}</div>
        ${services.length ? '' : '<p class="section-copy">Belum ada layanan yang ditampilkan.</p>'}
      </section>
      <section class="church-hub-panel" aria-label="Informasi gereja">
        <div class="church-hub-panel-heading"><span class="church-hub-eyebrow">KABAR DARI GEREJA</span>
        <h2 class="section-heading" ${edit('newsTitle')}>${escape(data.newsTitle)}</h2></div>
        <div class="church-hub-news">${news.map(({item, index}) => `<article class="church-hub-news-card">
          <div class="church-hub-meta"><span class="church-hub-badge church-hub-badge-${categoryClass(item.category)}">${escape(item.category)}</span>
          ${item.date ? `<time datetime="${escape(item.date)}">${date(item.date)}</time>` : ''}</div>
          <h3 class="church-hub-card-title">${escape(item.title)}</h3><p class="church-hub-description">${escape(item.description)}</p>
          ${open(item, `news-${index}`, `${escape(item.actionLabel || 'Baca selengkapnya')} <i class="bi bi-arrow-right" aria-hidden="true"></i>`, 'church-hub-news-link')}
        </article>`).join('')}</div>
        ${news.length ? '' : '<p class="section-copy">Belum ada informasi yang ditampilkan.</p>'}
      </section>
    </div>${dialogs.join('')}
  </div>`;
}
