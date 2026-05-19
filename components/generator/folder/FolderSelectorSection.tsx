import { Autocomplete, Button, TextField, Typography } from '@mui/material';
import { Add, Search } from '@mui/icons-material';
import type { FolderData } from '@/types/types';
import { SectionHeader } from '../SectionHeader';
import { getHighlightedParts } from '../generatorUtils';

interface FolderSelectorSectionProps {
	selectedFolderId: number | null;
	folders: FolderData[];
	onSelectedFolderIdChange: (folderId: number | null) => void;
	onCreateFolder: () => void;
}

export function FolderSelectorSection({
	selectedFolderId,
	folders,
	onSelectedFolderIdChange,
	onCreateFolder,
}: FolderSelectorSectionProps) {
	const selectedFolder = folders.find((folder) => folder.id === selectedFolderId);

	return (
		<section>
			<SectionHeader
				step="01"
				title="Select Destination Folder"
				subtitle={selectedFolder?.name ?? 'No folder selected'}
			/>

			<div className="flex gap-3">
				<Autocomplete<FolderData, false, false, false>
					fullWidth
					value={selectedFolder ?? null}
					onChange={(_, newValue) => onSelectedFolderIdChange(newValue?.id ?? null)}
					options={folders}
					getOptionLabel={(option) => option.name}
					isOptionEqualToValue={(option, value) => option.id === value.id}
					className="[&_.MuiInputLabel-root.Mui-focused]:!text-[#e2001a] [&_.MuiOutlinedInput-root.Mui-focused_.MuiOutlinedInput-notchedOutline]:!border-[#e2001a] [&_.MuiOutlinedInput-root.Mui-focused_input::placeholder]:!text-[#e2001a] [&_.MuiOutlinedInput-root.Mui-focused_.MuiAutocomplete-popupIndicator]:!text-[#e2001a] [&_.MuiOutlinedInput-root.Mui-focused_.MuiAutocomplete-popupIndicator_.MuiSvgIcon-root]:!text-[#e2001a]"
					freeSolo={false}
					disableClearable={false}
					popupIcon={<Search />}
					filterOptions={(options, { inputValue }) => {
						if (!inputValue) return options.slice(0, 5);

						const filtered = options.filter((option) =>
							option.name.toLowerCase().includes(inputValue.toLowerCase())
						);
						return filtered.slice(0, 5);
					}}
					renderInput={(params) => (
						<TextField
							{...params}
							label="Search folder"
							placeholder="Type to search..."
							variant="outlined"
							className="bg-white"
						/>
					)}
					renderOption={(props, option, { inputValue }) => {
						const parts = getHighlightedParts(option.name, inputValue);

						return (
							<li {...props} key={option.id}>
								<Typography variant="body2">
									{parts.map((part, index) => (
										<span
											key={index}
											className={part.highlight ? 'font-bold text-[#e2001a] bg-red-50' : 'font-normal text-[#0a0a0a]'}
										>
											{part.text}
										</span>
									))}
								</Typography>
							</li>
						);
					}}
				/>

				<Button
					variant="outlined"
					startIcon={<Add />}
					onClick={onCreateFolder}
					className="whitespace-nowrap !min-h-[56px] !min-w-[170px] !px-6 !font-bold !text-[#0a0a0a] !border-black tracking-widest transition-all hover:!border-[#e2001a] hover:!bg-[#e2001a] hover:!text-white hover:scale-[1.03] [&_.MuiButton-startIcon]:!text-current [&_.MuiButton-startIcon_.MuiSvgIcon-root]:!text-current hover:[&_.MuiButton-startIcon]:!text-white hover:[&_.MuiButton-startIcon_.MuiSvgIcon-root]:!text-white"
				>
					NEW FOLDER
				</Button>
			</div>
		</section>
	);
}
