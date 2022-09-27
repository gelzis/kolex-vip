import { useContext, useState, useEffect } from "react";
import axios from "axios";
import { UserContext } from "context/UserContext";
import SetSelector from "HOC/SetSelector";
import Meta from "components/Meta";
import CardGallery from "@/components/Search/CardGallery";
import LoadingSpin from "@/components/LoadingSpin";
const Searcher = () => {
	const { user } = useContext(UserContext);
	const [selectedCollection, setSelectedCollection] = useState(null);
	const [cards, setCards] = useState([]);
	const [selectedCards, setSelectedCards] = useState([]);
	const [filter, setFilter] = useState({
		batch: "A",
		min: 1,
		max: 25,
		price: 1,
		sigsOnly: false,
	});
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		const getCards = async (collectionId) => {
			setLoading(true);
			const { data } = await axios.get(`/api/collections/cards/${collectionId}`, {
				headers: {
					jwt: user.jwt,
				},
			});
			if (data.success) {
				setLoading(false);
				setCards((prev) => [...prev, ...data.data]);
			}
		};
		const getStickers = async (collectionId) => {
			const { data } = await axios.get(`/api/collections/stickers/${collectionId}`, {
				headers: {
					jwt: user.jwt,
				},
			});
			if (data.success) {
				setCards((prev) => [...prev, ...data.data]);
			}
		};
		if (selectedCollection) {
			setSelectedCards([]);
			setCards([]);
			getCards(selectedCollection.collection.id);
			getStickers(selectedCollection.collection.id);
		}
	}, [selectedCollection]);

	return (
		<>
			<Meta title='Mint Search | Kolex VIP' />
			<div className='my-10 border p-2'>
				<div className='px-2 pt-2 font-semibold text-gray-300'>
					Selected Collection:
					{selectedCollection && (
						<span>
							{" "}
							{selectedCollection.collection.properties.seasons[0]} -{" "}
							{selectedCollection.collection.properties.tiers[0]} -{" "}
							{selectedCollection.collection.name}
						</span>
					)}
				</div>
				<div>{user && <SetSelector setSelectedCollection={setSelectedCollection} />}</div>
				<div className='mb-1 flex items-center pl-2 text-gray-300'>
					<label htmlFor='sigs' className='hover:cursor-pointer'>
						Only search for signatures
					</label>
					<input
						type='checkbox'
						name='sigs'
						id='sigs'
						className='ml-1 accent-orange-500 hover:cursor-pointer'
						onChange={(e) =>
							setFilter((prev) => ({ ...prev, sigsOnly: e.target.checked }))
						}
					/>
				</div>
				<div className='mb-2 flex w-fit flex-col pl-2 text-gray-300 sm:flex-row'>
					<div>
						<label htmlFor='batch'>Mint Batch: </label>
						<select
							id='batch'
							className='mb-2 mr-3 w-24 rounded-md border-gray-300 p-1 text-gray-900 transition-opacity focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-50 sm:mb-0'
							onChange={(e) => setFilter((prev) => ({ ...prev, batch: e.target.value }))}
							disabled={filter.sigsOnly}
						>
							<option value='A'>A</option>
							<option value='B'>B</option>
							<option value='C'>C</option>
							<option value='M'>M</option>
							<option value='HB'>HB</option>
						</select>
					</div>
					<div>
						<label htmlFor='minMint'>Minimum Mint: </label>
						<input
							type='number'
							name='minMint'
							id='minMint'
							min={1}
							disabled={filter.sigsOnly}
							className='mb-2 mr-3 w-24 rounded-md border border-gray-300 px-2 py-1 text-gray-900 transition-opacity focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-50 sm:mb-0'
							placeholder='Minimum Mint'
							value={filter.min}
							onChange={(e) => setFilter((prev) => ({ ...prev, min: e.target.value }))}
						/>
					</div>
					<div>
						<label htmlFor='maxMint'>Maximum Mint: </label>
						<input
							type='number'
							name='maxMint'
							id='maxMint'
							min={1}
							disabled={filter.sigsOnly}
							className='mb-2 mr-3 w-24 rounded-md border border-gray-300 px-2 py-1 text-gray-900 transition-opacity focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-50 sm:mb-0'
							placeholder='Maximum Mint'
							value={filter.max}
							onChange={(e) => setFilter((prev) => ({ ...prev, max: e.target.value }))}
						/>
					</div>
					<div>
						<label htmlFor='maxPrice'>Maximum price: </label>
						<input
							type='number'
							name='maxPrice'
							id='maxPrice'
							min={0.1}
							step={0.01}
							className='mb-2 w-24 rounded-md border border-gray-300 px-2 py-1 text-gray-900 transition-opacity focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-50 sm:mb-0'
							placeholder='Maximum Price'
							value={filter.price}
							onChange={(e) => setFilter((prev) => ({ ...prev, price: e.target.value }))}
						/>
					</div>
				</div>
				{loading && (
					<div className='flex justify-center py-2'>
						<LoadingSpin />
					</div>
				)}
				{cards.length > 0 && (
					<CardGallery
						cards={cards}
						selectedCards={selectedCards}
						setSelectedCards={setSelectedCards}
						user={user}
						filter={filter}
						selectedCollection={selectedCollection}
					/>
				)}
			</div>
		</>
	);
};
export default Searcher;
