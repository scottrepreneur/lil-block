import React from 'react';

import classes from './Block.module.css'

const Block = (props) => {

	const gasPercent = props.gasUsed / props.gasLimit * 100

	return (
		<div className={classes.Block}>
			<p className={classes.pHead}>{props.recency}</p>
			<h3>#{props.blockNumber}</h3>
			<p>This block contained {props.transactions} transactions.</p>
			<p>This block used {props.gasUsed} gas which was {gasPercent.toFixed(2)}% of the {props.gasLimit} gas limit.</p>
			<p>Miner: <b>{props.miner}</b></p>
		</div>
	);

}

export default Block;