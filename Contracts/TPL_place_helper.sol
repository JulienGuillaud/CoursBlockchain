// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.8;

import "./TPL_place_map.sol";

contract PlaceHelper is TPL_place_map {


  function getPixelsByOwner(address _owner) external view returns(Pixel[] memory) {
    Pixel[] memory ownedPixels = new Pixel[](ownerPixelCount[_owner]);
    uint counter = 0;
    for (uint i = 0; i < pixelsAccess.length; i++) {
        for (uint j = 0; j < pixelsAccess[i].length; j++) {
            if (pixelToOwner[pixelsAccess[i][j].id] == _owner) {
                ownedPixels[counter] = pixelsAccess[i][j];
                counter++;
            }
        }
    }
    return ownedPixels;
  }

    function getPixelByID(uint _id) public view returns (Pixel memory){
        Pixel memory searchedPixel;
        for (uint i = 0; i < pixelsAccess.length; i++) {
            for (uint j = 0; j < pixelsAccess[i].length; j++) {
                if (pixelsAccess[i][j].id == _id) {
                    searchedPixel = pixelsAccess[i][j];
                }
            }
        }
        return searchedPixel;
    }

    function getOwner(uint _id) public view returns (address) {
        address owner = pixelToOwner[_id];
        return owner;
    }

    function getIdByCoord(uint _x, uint _y) public view returns (uint) {
        uint id = pixelsAccess[_x][_y].id;
        return id;
    }

}
