// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Coco is ERC721, Ownable {
   
    uint256 private tokenID = 1;
    constructor() ERC721("coco", "coco") Ownable() { }

    mapping(uint256 => string) private _tokenURIs;

    modifier onlyOwner_() {
        require(tx.origin == owner(),"Only Owner can mint tokens");
        _;
    }

    function tokenURI(uint256 tokenId)
        public
        view
        virtual
        override
        returns (string memory)
    {
        return _tokenURIs[tokenId];
    }

    function exists(uint256 tokenId) internal view virtual returns (bool) {
        return _exists(tokenId);
    } 

    function mintToken(
       address _owner,
       uint256 _quantity
        
    ) public { 
        for(uint256 counter = 0;counter<_quantity;counter++){
        _safeMint(_owner, tokenID);
        tokenID++;
        
        }      
       
    }

    function transfer(
        address from,
        address to,
        uint256 tokenId
    ) public {
        _transfer(from, to, tokenId);
    }

    function buy(address from,address to, uint256 _tokenId) public payable returns(bool){
        require(from != msg.sender,"Can't purchase your NFT");
        require(exists(_tokenId),"Token doesn't exist");
        require(msg.value>0,"invalid price");
        transfer(from,to,_tokenId);
        payable(from).transfer(msg.value);
        return true;
    }

    function _isExist(
        uint256 tokenId
    ) 
    public view returns(bool) {
        return _exists(tokenId);
    }
}