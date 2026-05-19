export function revokePreviewIfBlob(preview: string): void {
	if (preview && !preview.startsWith('http')) {
		URL.revokeObjectURL(preview);
	}
}
