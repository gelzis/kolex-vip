import { useState, useContext } from "react";
import axios from "axios";
import pick from "lodash/pick";
import { UserContext } from "context/UserContext";
import SetSelector from "HOC/SetSelector";
import Meta from "@/components/Meta";
import CardGallery from "@/components/cardlister/CardGallery";
import LoadingSpin from "@/components/LoadingSpin";
import { useEffect } from "react";

const Cardlister = () => {
	const [selectedCollection, setSelectedCollection] = useState(null);
	const [cards, setCards] = useState([]);
	const [templates, setTemplates] = useState([]);
	const [loading, setLoading] = useState(false);
	const { user } = useContext(UserContext);

	useEffect(() => {
		selectedCollection && getCards();
	}, [selectedCollection]);

	const getCards = async () => {
		const id = 6635;
		setLoading(true);
		setTemplates([]);
		setCards([]);
		// const { data: templates } = await getCollection(id);
		const { data: templates } = await getCollection(selectedCollection.collection.id);
		// const { data: cards } = await getCardIds(user.user.id, id);
		const { data: cards } = await getCardIds(
			user.user.id,
			selectedCollection.collection.id
		);
		if (cards) {
			setCards(cards);
		}
		if (templates) {
			const countedTemplates = templates.map((card) => {
				const cardCount = cards.find((o) => o.cardTemplateId === card.id);
				const stickerCount = cards.find((o) => o.stickerTemplateId === card.id);
				const count = cardCount || stickerCount;
				return {
					...pick(card, [
						"id",
						"title",
						"images",
						"inCirculation",
						"cardType",
						"team",
						"treatmentId",
						"uuid",
					]),
					count: count
						? count.cardIds
							? count.cardIds.length
							: count.stickerIds.length
						: 0,
				};
			});
			setTemplates(countedTemplates);
			setLoading(false);
		}
	};

	const getCollection = async (collectionId) => {
		const { data: cards } = await axios.get(`/api/collections/cards/${collectionId}`, {
			headers: {
				jwt: user.jwt,
			},
		});
		const { data: stickers } = await axios.get(
			`/api/collections/stickers/${collectionId}`,
			{
				headers: {
					jwt: user.jwt,
				},
			}
		);
		const result = {
			success: cards.success && stickers.success,
			data: [...cards.data, ...stickers.data],
		};
		return result;
	};
	const getCardIds = async (userId, collectionId) => {
		const { data } = await axios.get(`/api/collections/users/${userId}/cardids`, {
			params: {
				collectionId: collectionId,
			},
			headers: {
				jwt: user.jwt,
			},
		});
		return data;
	};

	return (
		<>
			<Meta title='Card Lister | Kolex VIP' />
			<div className='px-4 pt-2 font-semibold text-gray-300'>
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
			<SetSelector setSelectedCollection={setSelectedCollection} />
			{loading && (
				<div className='flex justify-center py-2'>
					<LoadingSpin />
				</div>
			)}
			{cards.length > 0 && (
				<CardGallery cards={cards} templates={templates} user={user} />
			)}
		</>
	);
};
export default Cardlister;