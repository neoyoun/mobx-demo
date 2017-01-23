import React from 'react';

function FilterList({list}) {
	return (
		<ul>
			{list.map(item=>(
				<li className="filter-item">{item}</li>
				))}
		</ul>
		)
}