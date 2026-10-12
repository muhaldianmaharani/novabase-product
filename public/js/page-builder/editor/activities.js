// Shared by the editor canvas and public renderer; no content is injected as raw HTML.
export function renderActivities(block, editable, escape) {
  const data = block.data || {};
  const items = Array.isArray(data.items) ? data.items : [];
  const edit = path => editable ? `contenteditable="true" data-edit="${escape(block.id)}:${path}"` : '';
  const image = item => {
    const url = String(item.image || '').trim();
    const allowed = /^https?:\/\//i.test(url) || /^\/(?!\/)/.test(url)
      || /^data:image\/(png|jpe?g|gif|webp);base64,[a-z0-9+/=]+$/i.test(url);
    return allowed
      ? `<img class="activity-image" src="${escape(url)}" alt="${escape(item.title)}" loading="lazy">`
      : '<div class="activity-image activity-image-placeholder" role="img" aria-label="Foto kegiatan belum tersedia"><i class="bi bi-image" aria-hidden="true"></i></div>';
  };
  return `<div class="section-pad activities-section" data-activities>
    <div class="activities-heading">
      <div><h2 class="section-heading" ${edit('title')}>${escape(data.title)}</h2>
      <p class="section-copy" ${edit('text')}>${escape(data.text)}</p></div>
      ${items.length > 1 ? `<div class="activities-controls" aria-label="Navigasi kegiatan">
        <button type="button" class="btn btn-outline-dark" data-activities-step="-1" aria-label="Kegiatan sebelumnya"><i class="bi bi-arrow-left" aria-hidden="true"></i></button>
        <button type="button" class="btn btn-outline-dark" data-activities-step="1" aria-label="Kegiatan berikutnya"><i class="bi bi-arrow-right" aria-hidden="true"></i></button>
      </div>` : ''}
    </div>
    ${items.length ? `<div class="activities-track" tabindex="0" role="region" aria-label="Daftar kegiatan; geser untuk melihat kegiatan lainnya">
      ${items.map((item, index) => `<article class="activity-card" role="button" tabindex="0" data-activity-open="${index}" aria-haspopup="dialog" aria-label="${escape(item.title || 'Detail kegiatan')}">
        ${image(item)}<div class="activity-copy">
          <h3 ${edit(`items.${index}.title`)}>${escape(item.title)}</h3>
          <p ${edit(`items.${index}.summary`)}>${escape(item.summary)}</p>
        </div>
      </article>`).join('')}
    </div>` : '<p class="section-copy activities-empty">Belum ada kegiatan yang ditampilkan.</p>'}
    ${items.map((item, index) => {
      const titleId = `activity-title-${block.id}-${index}`;
      return `<dialog class="activity-dialog" data-activity-dialog="${index}" aria-labelledby="${escape(titleId)}">
        <div class="activity-dialog-header"><h3 id="${escape(titleId)}">${escape(item.title)}</h3>
        <button type="button" class="btn btn-outline-dark" data-activity-close aria-label="Tutup detail kegiatan" autofocus><i class="bi bi-x-lg" aria-hidden="true"></i></button></div>
        ${image(item)}<div class="activity-description">${escape(item.description || item.summary)}</div>
      </dialog>`;
    }).join('')}
  </div>`;
}

export function bindActivities(root) {
  root.querySelectorAll('[data-activities]').forEach(section => {
    const track = section.querySelector('.activities-track');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const step = direction => {
      if (!track) return;
      const card = track.querySelector('.activity-card');
      const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
      track.scrollBy({ left: direction * ((card?.getBoundingClientRect().width || track.clientWidth) + gap), behavior: reduced ? 'instant' : 'smooth' });
    };
    section.querySelectorAll('[data-activities-step]').forEach(button => {
      button.addEventListener('click', event => {
        event.stopPropagation();
        step(Number(button.dataset.activitiesStep));
      });
    });
    track?.addEventListener('keydown', event => {
      if (event.target !== track || !['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
      event.preventDefault();
      step(event.key === 'ArrowRight' ? 1 : -1);
    });
    section.querySelectorAll('[data-activity-open]').forEach(button => {
      const open = event => {
        // Inline text editing must still select the section rather than open its dialog.
        if (event.target.closest('[contenteditable="true"]')) return;
        event.stopPropagation();
        const dialog = section.querySelector(`[data-activity-dialog="${button.dataset.activityOpen}"]`);
        if (!dialog || dialog.open) return;
        dialog.showModal();
        dialog.addEventListener('close', () => button.focus(), { once: true });
      };
      button.addEventListener('click', open);
      button.addEventListener('keydown', event => {
        if (event.target !== button || !['Enter', ' '].includes(event.key)) return;
        event.preventDefault();
        open(event);
      });
    });
    section.querySelectorAll('dialog').forEach(dialog => {
      dialog.addEventListener('click', event => {
        event.stopPropagation();
        if (event.target.closest('[data-activity-close]')) dialog.close();
        if (event.target === dialog) {
          const rect = dialog.getBoundingClientRect();
          if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
        }
      });
    });
  });
}
