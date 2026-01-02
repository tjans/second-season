import { UUID } from "@/types/UUID";

const utilities = {
    isEdit: (id: string) => {
        return id !== "0" && id !== undefined && id !== null;
    },

    newId: () => crypto.randomUUID() as UUID
};

export default utilities;