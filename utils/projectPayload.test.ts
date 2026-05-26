import test from 'node:test';
import assert from 'node:assert/strict';
import { buildProjectPayload } from './projectPayload.ts';

test('buildProjectPayload keeps uploaded cover and gallery URLs', () => {
	const payload = buildProjectPayload(
		'My Project',
		'https://res.cloudinary.com/demo/image/upload/v1/cover.jpg',
		[
			'https://res.cloudinary.com/demo/image/upload/v1/gallery-1.jpg',
			'https://res.cloudinary.com/demo/image/upload/v1/gallery-2.jpg',
		],
	);

	assert.deepEqual(payload, {
		name: 'My Project',
		coverImage: 'https://res.cloudinary.com/demo/image/upload/v1/cover.jpg',
		galleryImages: [
			'https://res.cloudinary.com/demo/image/upload/v1/gallery-1.jpg',
			'https://res.cloudinary.com/demo/image/upload/v1/gallery-2.jpg',
		],
	});
});

test('buildProjectPayload defaults galleryImages to an empty list', () => {
	const payload = buildProjectPayload('Empty Gallery', 'https://res.cloudinary.com/demo/image/upload/v1/cover.jpg');

	assert.deepEqual(payload, {
		name: 'Empty Gallery',
		coverImage: 'https://res.cloudinary.com/demo/image/upload/v1/cover.jpg',
		galleryImages: [],
	});
});

