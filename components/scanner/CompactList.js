import { useState } from "react";
import sortBy from "lodash/sortBy";
import { FaSignature } from "react-icons/fa";

const CompactList = ({ results }) => {
	const [sortMethod, setSortMethod] = useState("mint");
	const handleSort = (e) => {
		setSortMethod(e.target.value);
	};
	return (
		<>
			<div className='flex items-center p-2'>
				<label htmlFor='sort' className='mr-1 text-gray-800 dark:text-gray-300'>
					Sort By:{" "}
				</label>
				<select
					name='sort'
					id='sort'
					className='rounded-md border border-gray-700 p-1 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-gray-300'
					onChange={handleSort}
				>
					<option value='mint'>Mint</option>
					<option value='owned'>Owned</option>
					<option value='circ'>Circulation</option>
				</select>
			</div>
			<div className='overflow-x-auto'>
				<table className='w-full table-auto overflow-hidden border-t text-gray-600 transition-colors dark:text-gray-400'>
					<thead className='bg-gray-300 uppercase text-gray-800 transition-colors dark:bg-gray-700 dark:text-gray-400'>
						<tr>
							<th className='py-1 px-2 sm:py-3 sm:px-6'>Best Mint</th>
							<th className='py-1 px-2 sm:py-3 sm:px-6'>Title</th>
							<th className='py-1 px-2 sm:py-3 sm:px-6'>Owned</th>
							<th className='py-1 px-2 sm:py-3 sm:px-6'>Circulation</th>
						</tr>
					</thead>
					<tbody className='text-center transition-colors'>
						{sortBy(
							results,
							sortMethod === "mint"
								? [
										"mintBatch",
										"mintNumber",
										(o) => -o.signatureImage,
										(o) => -o.owned,
										"inCirculation",
								  ]
								: sortMethod === "owned"
								? [
										(o) => -o.owned,
										"mintBatch",
										"mintNumber",
										(o) => -o.signatureImage,
										"inCirculation",
								  ]
								: [
										"inCirculation",
										"mintBatch",
										"mintNumber",
										(o) => -o.signatureImage,
										(o) => -o.owned,
								  ]
						).map((item) => (
							<tr
								className='border-b bg-white transition-colors hover:bg-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-600'
								key={item.id}
							>
								<td
									className={`py-1 px-2 sm:py-3 sm:px-6 ${
										item.signatureImage ? "text-yellow-400" : ""
									}`}
									title={item.signatureImage ? "Signed" : undefined}
								>
									<div className='flex items-center justify-center'>
										{item.signatureImage && <FaSignature className='mr-2' />}
										{item.mintBatch}
										{item.mintNumber}
									</div>
								</td>
								<td className='min-w-[10rem] py-1 px-2 sm:py-3 sm:px-6'>{item.title}</td>
								<td className='py-1 px-2 sm:py-3 sm:px-6'>{item.owned}</td>
								<td className='py-1 px-2 sm:py-3 sm:px-6'>{item.inCirculation}</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</>
	);
};
export default CompactList;
