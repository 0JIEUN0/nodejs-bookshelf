import { Shelf } from "../models/Shelf.js";

export default {
    findAllShelves: async (userId) => {
        return { shelves: await Shelf.find({ userId: userId }) }
    },
    addNewShelf: async (userId, shelfDto) => {
        if (shelfDto.name == undefined) throw { status: 400, message: "Name of shelf must be provided." }
        shelfDto.userId = userId;

        const shelf = new Shelf(shelfDto)

        await shelf.save()
        return {};
    },
}
