import { UUID } from "@/types/UUID";
import { Fighter } from "@/types/Fighter";
import { OpenActionResult, RoundMode } from "@/types/Round";

const utilities = {
    isEdit: (id: string) => {
        return id !== "0" && id !== undefined && id !== null;
    },

    newId: () => crypto.randomUUID() as UUID,

    getEndurance(fighter: Fighter): number {
        return (fighter.DUR * 2) + fighter.WIL;
    },

    getOpenActionMode: (redMode: RoundMode, blueMode: RoundMode): OpenActionResult => {
        const actionChart: Record<RoundMode, Record<RoundMode, OpenActionResult>> = {
            ELU: {
                ELU: "CHESS",
                OUT: "CHESS",
                INS: "NORMAL",
                PRS: "NORMAL",
            },
            OUT: {
                ELU: "CHESS",
                OUT: "CHESS",
                INS: "NORMAL",
                PRS: "NORMAL",
            },
            INS: {
                ELU: "NORMAL",
                OUT: "NORMAL",
                INS: "BRAWL",
                PRS: "BRAWL",
            },
            PRS: {
                ELU: "NORMAL",
                OUT: "NORMAL",
                INS: "BRAWL",
                PRS: "BRAWL",
            },
        };

        const result = actionChart[redMode]?.[blueMode];
        if (result) return result;

        // Fallback: swap order
        return actionChart[blueMode][redMode];
    },

    getEnduranceDeduction(hurtPoints: number, roundMode: RoundMode): number {
        let modeDeduction = roundMode == "PRS" ? -3 : -2;
        let tkoDeduction = Math.floor(hurtPoints / 6) * -1;

        return modeDeduction + tkoDeduction;
    },

    getSegmentTime(segment: number): string {
        // each segment is 20 seconds, starting with the "bell" which is segment 1
        // segment 1 is "Bell"
        // segment 2 is :20
        // segment 3 is :40
        // segment 9 is 2:40, the last segment

        const displays: { [key: number]: string } = {
            1: "Bell",
            2: ":20",
            3: ":40",
            4: "1:00",
            5: "1:20",
            6: "1:40",
            7: "2:00",
            8: "2:20",
            9: "2:40",
            10: "End Bell"
        }

        return displays[segment] || "Unknown";
    },

    getTko(fighter: Fighter): number {
        return Math.ceil((fighter.DUR + fighter.WIL) / 2);
    },

    // getCompetitionTier: (compLevel: string) => {
    //     if (compLevel === "Regional") {
    //         return {
    //             titleChallengeRep: 20,
    //             promotionRep: 25,
    //             nextCompLevel: "National",
    //             normalRounds: "4-6 rounds",
    //             titleRounds: "8 rounds"
    //         };
    //     } else if (compLevel === "National") {
    //         return {
    //             titleChallengeRep: 40,
    //             promotionRep: 50,
    //             nextCompLevel: "Continental",
    //             debutRounds: "",
    //             normalRounds: "8 rounds",
    //             titleRounds: "10 rounds"
    //         };
    //     } else if (compLevel === "Continental") {
    //         return {
    //             titleChallengeRep: 70,
    //             promotionRep: 80,
    //             nextCompLevel: "World",
    //             normalRounds: "10 rounds",
    //             titleRounds: "12 rounds"
    //         };
    //     } else if (compLevel === "World") {
    //         return {
    //             titleChallengeRep: 100,
    //             promotionRep: 120,
    //             nextCompLevel: "N/A",
    //             normalRounds: "10-12 rounds",
    //             titleRounds: "12-15 rounds"
    //         };
    //     }
    // },

};

export default utilities;