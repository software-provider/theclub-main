import React, { useState } from 'react';

const NFTCard = ({ nft }) => {
    return (
        <div className='card nft-card'>
            <img src={nft.meta.content[1].url} className="nft-image" />
            <div className="card content">
                <div className="card content-item">
                    Contract Address:
                </div>
                <div className="card address">
                    {nft.contract}
                </div>
                <div className="card content-item">
                    Collection address:
                </div>
                <div className="card address">
                    {nft.collection}
                </div>
                <div className="card content-item">
                    NFT Name:
                </div>
                <div className="card">
                    {nft.meta.name}
                </div>

                <div className="card content-item">
                    Collection description:
                </div>
                <div className="card">
                    {nft.meta.description}
                </div>
            </div>

        </div>
    )
}

export default NFTCard;