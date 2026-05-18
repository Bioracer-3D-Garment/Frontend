import { useState } from 'react';
import type { Model } from '@/types/types';

export function useModels() {
	const [models, setModels] = useState<Model[]>([]);

	const toggleModelSelection = (id: string) => {
		setModels((currentModels) =>
			currentModels.map((model) => (model.id === id ? { ...model, selected: !model.selected } : model))
		);
	};

	const selectedModels = models.filter((model) => model.selected).length;

	return {
		models,
		selectedModels,
		toggleModelSelection,
	};
}
