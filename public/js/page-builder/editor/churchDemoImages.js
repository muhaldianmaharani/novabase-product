// Local stock photos for church presentations; custom content is never replaced.
export const churchDemoImages = Object.fromEntries(
  ['worship', 'fellowship', 'bible', 'church'].map(name => [
    name, new URL(`../../../images/website-demo/${name}.jpg`, import.meta.url).pathname,
  ]),
);

const legacyPhotoIds = [
  '1497366754035-f200968a6e72', '1518005020951-eccb494ad742',
  '1524758631624-e2822e304c36', '1519389950473-47ba0277781c',
  '1556761175-b413da4baf72',
];
const isLegacyPhoto = value => typeof value === 'string'
  && value.startsWith('https://images.unsplash.com/photo-')
  && legacyPhotoIds.some(id => value.startsWith(`https://images.unsplash.com/photo-${id}?`));

export function activityDemoImage(index = 0) {
  return [churchDemoImages.worship, churchDemoImages.fellowship, churchDemoImages.bible][index % 3];
}

export function withChurchDemoImages(type, source) {
  const data = structuredClone(source || {});
  if (['hero', 'split'].includes(type) && (!data.image || isLegacyPhoto(data.image))) {
    data.image = type === 'hero' ? churchDemoImages.worship : churchDemoImages.church;
  }
  if (type === 'gallery' && Array.isArray(data.images)) {
    const photos = Object.values(churchDemoImages);
    data.images = data.images.map((image, index) => !image || isLegacyPhoto(image) ? photos[index % photos.length] : image);
  }
  if (type === 'activities' && Array.isArray(data.items)) {
    data.items = data.items.map((item, index) => ({ ...item, image: item.image || activityDemoImage(index) }));
  }
  return data;
}
