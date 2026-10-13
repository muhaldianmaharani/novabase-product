import { blockTypes, blockDefinitions } from './blockRegistry.js';
import { escapeHtml } from './siteRenderer.js';
import { withChurchDemoImages } from './churchDemoImages.js';
import { churchHubData } from './churchHub.js';

export function renderInspector(block) {
  if (!block) return '';
  if (['hero', 'split', 'gallery', 'activities'].includes(block.type)) {
    block = { ...block, data: withChurchDemoImages(block.type, block.data) };
  }

  const imageFields = [];

  if (block.data.image !== undefined) {
    imageFields.push(imageField(block.id, 'image', block.data.image));
  }

  if (Array.isArray(block.data.images)) {
    block.data.images.forEach((image, index) => {
      imageFields.push(imageField(block.id, `images.${index}`, image, `Gallery image ${index + 1}`));
    });
  }

  if (Array.isArray(block.data.logos)) {
    block.data.logos.forEach((logo, index) => {
      imageFields.push(imageField(block.id, `logos.${index}.image`, logo.image, `Logo ${index + 1}`));
      imageFields.push(textField(block.id, `logos.${index}.link`, logo.link, `Logo ${index + 1} link`));
    });
  }

  const buttonLink = block.data.buttonUrl !== undefined
    ? textField(block.id, 'buttonUrl', block.data.buttonUrl, 'Button link')
    : '';

  const videoLink = block.data.videoUrl !== undefined
    ? textField(block.id, 'videoUrl', block.data.videoUrl, 'YouTube link')
    : '';

  const itemLinks = Array.isArray(block.data.items)
    ? block.data.items.map((item, index) => item.link !== undefined
      ? textField(block.id, `items.${index}.link`, item.link, `Item ${index + 1} link`)
      : '').join('')
    : '';

  const planLinks = Array.isArray(block.data.plans)
    ? block.data.plans.map((plan, index) => textField(block.id, `plans.${index}.link`, plan.link, `Plan ${index + 1} link`)).join('')
    : '';

  const addonFields = renderDefinitionFields(block);
  const activityControls = block.type === 'activities' ? renderActivityControls(block) : '';
  const churchHubControls = block.type === 'church-hub' ? renderChurchHubControls(block) : '';

  const cardsControl = block.type === 'cards'
    ? `<button class="btn btn-outline-primary btn-sm w-100" data-inspector-action="add-card"><i class="bi bi-plus-lg"></i> Tambah Card</button>`
    : '';

  const galleryControl = block.type === 'gallery'
    ? `<button class="btn btn-outline-primary btn-sm w-100" data-inspector-action="add-gallery-image"><i class="bi bi-image"></i> Tambah Gambar</button>`
    : '';

  const logoControl = block.type === 'logos'
    ? `<button class="btn btn-outline-primary btn-sm w-100" data-inspector-action="add-logo"><i class="bi bi-plus-lg"></i> Tambah Logo</button>`
    : '';

  const testimonialControl = block.type === 'testimonials'
    ? `<button class="btn btn-outline-primary btn-sm w-100" data-inspector-action="add-testimonial"><i class="bi bi-plus-lg"></i> Tambah Testimonial</button>`
    : '';

  const pricingControl = block.type === 'pricing'
    ? `<button class="btn btn-outline-primary btn-sm w-100" data-inspector-action="add-plan"><i class="bi bi-plus-lg"></i> Tambah Paket</button>`
    : '';

  const splitControl = block.type === 'split'
    ? `
      <label class="form-label">Posisi gambar</label>
      <select class="form-select form-select-sm" data-inspector-field="imagePosition">
        <option value="left" ${block.data.imagePosition === 'left' ? 'selected' : ''}>Kiri</option>
        <option value="right" ${block.data.imagePosition === 'right' ? 'selected' : ''}>Kanan</option>
      </select>
    `
    : '';

  return `
    <div class="inspector-card">
      <div class="fw-bold mb-1">${blockTypes[block.type] ?? block.type}</div>
      <div class="text-secondary small">ID: ${block.id}</div>
    </div>
    <div class="inspector-card">
      ${navControl(block)}
      ${addonFields}
      ${activityControls}
      ${churchHubControls}
      ${block.navEnabled ? rootTextField(block.id, 'navLabel', block.navLabel ?? block.data.title ?? block.type, 'Nama section di navbar') : ''}
      ${splitControl}
      ${splitControl ? '<hr>' : ''}
      ${buttonLink}
      ${videoLink}
      ${itemLinks}
      ${planLinks}
      ${imageFields.join('')}
      ${cardsControl}
      ${galleryControl}
      ${logoControl}
      ${testimonialControl}
      ${pricingControl}
    </div>
    <div class="inspector-card d-grid gap-2">
      <button class="btn btn-outline-primary btn-sm" data-inspector-action="add-after"><i class="bi bi-plus-lg"></i> Tambah Section Setelah Ini</button>
      <button class="btn btn-outline-dark btn-sm" data-inspector-action="duplicate"><i class="bi bi-copy"></i> Duplikat Section</button>
      <button class="btn btn-outline-danger btn-sm" data-inspector-action="delete"><i class="bi bi-trash"></i> Hapus Section</button>
    </div>
  `;
}

function imageField(blockId, path, value, label = 'Gambar') {
  return `
    <div class="mb-3">
      <label class="form-label">${label} URL</label>
      <input class="form-control form-control-sm" value="${escapeHtml(value)}" data-image-field="${blockId}:${path}">
      <label class="btn btn-outline-secondary btn-sm w-100 mt-2">
        <i class="bi bi-upload"></i>
        Upload file
        <input type="file" accept="image/*" class="d-none" data-upload-field="${blockId}:${path}">
      </label>
    </div>
  `;
}

function renderActivityControls(block) {
  const items = Array.isArray(block.data.items) ? block.data.items : [];
  const textarea = (path, value, label, max) => `<label class="form-label">${label}<textarea class="form-control form-control-sm" rows="4" maxlength="${max}" data-text-field="${block.id}:${path}">${escapeHtml(value)}</textarea></label>`;
  return `${textField(block.id, 'title', block.data.title, 'Judul section')}
    ${textarea('text', block.data.text, 'Pengantar section', 5000)}
    <p class="small text-secondary">${items.length} kegiatan. Geser kartu atau gunakan panah. Maksimal 100 kegiatan.</p>
    ${items.map((item, index) => `<fieldset class="activity-inspector-item"><legend>Kegiatan ${index + 1}</legend>
      ${imageField(block.id, `items.${index}.image`, item.image, 'Foto kegiatan')}
      ${textField(block.id, `items.${index}.title`, item.title, 'Judul kegiatan')}
      ${textarea(`items.${index}.summary`, item.summary, 'Deskripsi singkat', 5000)}
      ${textarea(`items.${index}.description`, item.description, 'Deskripsi lengkap (popup)', 5000)}
      <div class="d-flex gap-2 flex-wrap">
        <button type="button" class="btn btn-outline-dark btn-sm" data-inspector-action="activity-up" data-activity-index="${index}" ${index === 0 ? 'disabled' : ''} aria-label="Pindahkan kegiatan ${index + 1} ke atas">↑</button>
        <button type="button" class="btn btn-outline-dark btn-sm" data-inspector-action="activity-down" data-activity-index="${index}" ${index === items.length - 1 ? 'disabled' : ''} aria-label="Pindahkan kegiatan ${index + 1} ke bawah">↓</button>
        <button type="button" class="btn btn-outline-danger btn-sm" data-inspector-action="remove-activity" data-activity-index="${index}">Hapus kegiatan</button>
      </div></fieldset>`).join('')}
    <button type="button" class="btn btn-outline-primary btn-sm w-100" data-inspector-action="add-activity" ${items.length >= 100 ? 'disabled' : ''}>Tambah kegiatan</button>`;
}

function renderChurchHubControls(block) {
  const data = churchHubData(block.data);
  const field = (path, value, label, type = 'text') => `<label class="form-label">${label}
    ${type === 'textarea'
      ? `<textarea class="form-control form-control-sm" rows="3" maxlength="5000" data-text-field="${block.id}:${path}">${escapeHtml(value)}</textarea>`
      : `<input class="form-control form-control-sm" type="${type}" maxlength="5000" value="${escapeHtml(value)}" data-text-field="${block.id}:${path}">`}</label>`;
  return `${field('servicesTitle', data.servicesTitle, 'Judul panel layanan')}
    ${field('newsTitle', data.newsTitle, 'Judul panel informasi')}
    <p class="small text-secondary">Tautan kosong membuka popup detail. Isi URL halaman atau kanal resmi untuk mengarahkan pengunjung. Tanggal contoh dapat diedit.</p>
    ${['services', 'news'].map(group => {
      const items = Array.isArray(data[group]) ? data[group] : [];
      const label = group === 'services' ? 'Layanan' : 'Informasi';
      return `<h3 class="h6 mt-3">${label} (${items.length}/100)</h3>${items.map((item, index) => {
        const path = `${group}.${index}`;
        const action = (name, text, disabled = false) => `<button type="button" class="btn btn-outline-secondary btn-sm" data-inspector-action="hub-${name}" data-hub-group="${group}" data-hub-index="${index}" ${disabled ? 'disabled' : ''}>${text}</button>`;
        return `<fieldset class="church-hub-inspector-item"><legend>${label} ${index + 1}</legend>
          ${group === 'services' ? field(`${path}.icon`, item.icon, 'Ikon Bootstrap (contoh: bi-heart)') : field(`${path}.category`, item.category, 'Kategori (Pengumuman / Kegiatan / Informasi)')}
          ${field(`${path}.title`, item.title, 'Judul')}
          ${field(`${path}.description`, item.description, 'Deskripsi singkat', 'textarea')}
          ${group === 'news' ? field(`${path}.date`, item.date, 'Tanggal', 'date') + field(`${path}.actionLabel`, item.actionLabel, 'Teks tautan') : ''}
          ${field(`${path}.link`, item.link, 'Tautan (kosong = popup detail)')}
          ${field(`${path}.details`, item.details, 'Isi popup detail', 'textarea')}
          <label class="form-label">Visibilitas<select class="form-select form-select-sm" data-text-field="${block.id}:${path}.enabled">
            <option value="1" ${item.enabled !== '0' ? 'selected' : ''}>Aktif / ditampilkan</option>
            <option value="0" ${item.enabled === '0' ? 'selected' : ''}>Nonaktif / disembunyikan</option>
          </select></label>
          <div class="d-flex gap-2 flex-wrap">${action('up', 'Naik', index === 0)}${action('down', 'Turun', index === items.length - 1)}${action('remove', 'Hapus')}</div>
        </fieldset>`;
      }).join('')}<button type="button" class="btn btn-outline-primary btn-sm w-100" data-inspector-action="hub-add" data-hub-group="${group}" ${items.length >= 100 ? 'disabled' : ''}>Tambah ${label.toLowerCase()}</button>`;
    }).join('')}`;
}

function textField(blockId, path, value, label) {
  return `
    <div class="mb-3">
      <label class="form-label">${label}</label>
      <input class="form-control form-control-sm" value="${escapeHtml(value)}" data-text-field="${blockId}:${path}">
    </div>
  `;
}

function rootTextField(blockId, path, value, label) {
  return `
    <div class="mb-3">
      <label class="form-label">${label}</label>
      <input class="form-control form-control-sm" value="${escapeHtml(value)}" data-root-field="${blockId}:${path}">
    </div>
  `;
}

function navControl(block) {
  if (block.navEnabled) {
    return `
      <div class="mb-3 d-grid gap-2">
        <div class="small text-secondary">Section ini tampil di navbar.</div>
        <button class="btn btn-outline-warning btn-sm" data-inspector-action="remove-nav-section">
          <i class="bi bi-dash-circle"></i>
          Hapus dari Daftar Section
        </button>
      </div>
    `;
  }

  return `
    <div class="mb-3 d-grid gap-2">
      <div class="small text-secondary">Block ini belum masuk daftar section navbar.</div>
      <button class="btn btn-outline-primary btn-sm" data-inspector-action="add-nav-section">
        <i class="bi bi-list-ul"></i>
        Tambah ke Daftar Section
      </button>
    </div>
  `;
}

function renderDefinitionFields(block) {
  const fields = blockDefinitions[block.type]?.fields ?? [];
  return fields.map((field) => {
    const value = block.data[field.path] ?? "";
    const label = escapeHtml(field.label || field.path);
    const escaped = escapeHtml(value);
    if (field.type === "textarea") {
      return `<div class="mb-3"><label class="form-label">${label}</label><textarea class="form-control form-control-sm" data-text-field="${block.id}:${field.path}">${escaped}</textarea></div>`;
    }
    return `<div class="mb-3"><label class="form-label">${label}</label><input class="form-control form-control-sm" type="${field.type === "url" ? "url" : "text"}" value="${escaped}" data-text-field="${block.id}:${field.path}"></div>`;
  }).join("");
}
