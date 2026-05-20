import { Autocomplete, Button, TextField, Typography } from '@mui/material';
import { Add, Search } from '@mui/icons-material';
import type { Project } from '@/types/types';
import { SectionHeader } from '../SectionHeader';
import { getHighlightedParts } from '../generatorUtils';

interface ProjectSelectorSectionProps {
	selectedProjectId: number | null;
	projects: Project[];
	onSelectProject: (projectId: number | null) => void;
	onCreateProject: () => void;
}

export function ProjectSelectorSection({
	selectedProjectId,
	projects,
	onSelectProject,
	onCreateProject,
}: ProjectSelectorSectionProps) {
	const selectedProject = projects.find((project) => project.id === selectedProjectId);

	return (
		<section>
			<SectionHeader
				step="01"
				title="Select Destination Project"
				subtitle={selectedProject?.name ?? 'No project selected'}
			/>

			<div className="flex gap-3">
				<Autocomplete<Project, false, false, false>
					fullWidth
					value={selectedProject ?? null}
					onChange={(_, newValue) => onSelectProject(newValue?.id ?? null)}
					options={projects}
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
							label="Search project"
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
					onClick={onCreateProject}
					className="whitespace-nowrap !min-h-[56px] !min-w-[170px] !px-6 !font-bold !text-[#0a0a0a] !border-black tracking-widest transition-all hover:!border-[#e2001a] hover:!bg-[#e2001a] hover:!text-white hover:scale-[1.03] [&_.MuiButton-startIcon]:!text-current [&_.MuiButton-startIcon_.MuiSvgIcon-root]:!text-current hover:[&_.MuiButton-startIcon]:!text-white hover:[&_.MuiButton-startIcon_.MuiSvgIcon-root]:!text-white"
				>
					NEW PROJECT
				</Button>
			</div>
		</section>
	);
}
