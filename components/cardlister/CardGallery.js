import { useState } from "react";
import Image from "next/future/image";
import sortBy from "lodash/sortBy";
import ListingModal from "./ListingModal";
const CardGallery = ({ templates, user }) => {
	const [selectedTemplates, setSelectedTemplates] = useState([]);
	const [showListingModal, setShowListingModal] = useState(false);
	return (
		<>
			<div className='ml-1 flex h-full'>
				<div className='flex flex-col sm:block'>
					<button
						onClick={() => setSelectedTemplates(templates.filter((item) => item.count))}
						className='m-1 cursor-pointer rounded-md border border-gray-200 px-3 py-2 text-center text-gray-300 shadow-lg transition-colors hover:bg-gray-300 hover:text-gray-800 active:bg-gray-400'
					>
						Select All
					</button>
					<button
						onClick={() => setSelectedTemplates([])}
						className='m-1 cursor-pointer rounded-md border border-gray-200 px-3 py-2 text-center text-gray-300 shadow-lg transition-colors hover:bg-gray-300 hover:text-gray-800 active:bg-gray-400'
					>
						Deselect All
					</button>
				</div>
				<div className='ml-auto flex flex-col justify-end py-1 sm:block'>
					<button
						className='mb-2 mr-2 inline-flex cursor-pointer items-center rounded-md border border-transparent border-gray-200 bg-gray-100 py-2 px-3 text-center font-medium text-orange-500 shadow-lg transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 active:shadow-lg enabled:hover:bg-gray-300 enabled:hover:text-orange-600 enabled:active:bg-gray-400 disabled:cursor-not-allowed disabled:opacity-50 sm:mb-0'
						onClick={() => {
							setShowListingModal(true);
						}}
						disabled={!selectedTemplates.length}
					>
						Next
					</button>
				</div>
			</div>

			<div className='m-2 grid grid-cols-2 gap-3 sm:grid-cols-4 md:grid-cols-5'>
				{sortBy(templates, (o) => -o.count)
					.filter((item) => item.count)
					.map((card) => (
						<div
							key={card.uuid}
							className={`relative flex ${
								card.count === 0 ? "cursor-not-allowed" : "cursor-pointer hover:scale-105"
							} flex-col items-center border border-gray-500 text-gray-300 shadow-md transition-transform`}
							onClick={() => {
								selectedTemplates.some((e) => e.id === card.id)
									? setSelectedTemplates((prev) =>
											prev.filter((item) => item.id !== card.id)
									  )
									: setSelectedTemplates((prev) => [...prev, card]);
							}}
						>
							<div className='relative aspect-auto w-24 overflow-hidden rounded-md p-0.5 sm:w-36'>
								<Image
									src={
										card.images?.size402 || `https://cdn.kolex.gg${card.images[0].url}`
									}
									width={200 * 1.5}
									height={300 * 1.5}
									alt={card.title}
									className={`h-full w-full rounded-lg border-4 object-cover transition-colors ${
										selectedTemplates.some((e) => e.id === card.id)
											? "border-orange-500 grayscale-0"
											: "border-transparent"
									}`}
									priority='true'
									unoptimized={true}
								/>
								{!selectedTemplates.some((e) => e.id === card.id) && (
									<div className='absolute inset-1 z-20 rounded-md bg-black/60'></div>
								)}
							</div>
							<div className='mb-1 p-1 text-center text-sm'>{card.title}</div>
							<div className='mt-auto w-full border-t text-center text-xs font-semibold text-orange-500'>
								x<span className='text-base'>{card.count}</span>
							</div>
						</div>
					))}
			</div>
			{showListingModal && (
				<ListingModal
					setShowListingModal={setShowListingModal}
					selectedTemplates={selectedTemplates}
					user={user}
					templates={templates}
				/>
			)}
		</>
	);
};
export default CardGallery;
