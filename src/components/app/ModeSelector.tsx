// Types
import { Fighter } from '@/types/Fighter';

// Icons
import { GiBoxingGlove } from "react-icons/gi";

// Components
import Button from '@/components/Elements/Button';
import { RoundMode } from '@/types/Round';
import { FighterColor } from '@/types/ExpressGame';
import { UUID } from '@/types/UUID';

interface ModeSelectorProps {
    fighter: Fighter | null;
    variant: FighterColor;
    selectedMode: RoundMode | null | undefined;
    onSelectMode: (mode: RoundMode, fighterId: UUID) => void;
}

const ModeSelector = ({ fighter, variant, selectedMode, onSelectMode }: ModeSelectorProps) => {
    let INSclass = ""
    let OUTclass = ""
    let PRSclass = ""
    let ELUclass = ""

    if (variant === "blue") {
        INSclass = selectedMode === "INS" ? "bg-blue-900" : "bg-blue-400";
        OUTclass = selectedMode === "OUT" ? "bg-blue-900" : "bg-blue-400";
        PRSclass = selectedMode === "PRS" ? "bg-blue-900" : "bg-blue-400";
        ELUclass = selectedMode === "ELU" ? "bg-blue-900" : "bg-blue-400";
    } else {
        INSclass = selectedMode === "INS" ? "bg-red-900" : "bg-red-400";
        OUTclass = selectedMode === "OUT" ? "bg-red-900" : "bg-red-400";
        PRSclass = selectedMode === "PRS" ? "bg-red-900" : "bg-red-400";
        ELUclass = selectedMode === "ELU" ? "bg-red-900" : "bg-red-400";
    }

    return (
        <>
            {fighter &&
                <div className="w-1/2 text-center">
                    <div className="font-bold mb-2">{fighter.name || 'Unknown Fighter'}</div>
                    <div className="flex gap-2 mb-4 justify-center flex-wrap">
                        <Button overrideClasses={`w-32 text-white ${OUTclass}`} onClick={() => onSelectMode("OUT", fighter.id)}>OUT ({fighter.outsideRange})</Button>
                        <Button overrideClasses={`w-32 text-white ${INSclass}`} onClick={() => onSelectMode("INS", fighter.id)}>INS ({fighter.insideRange})</Button>
                        <Button overrideClasses={`w-32 text-white ${ELUclass}`} onClick={() => onSelectMode("ELU", fighter.id)}>ELU ({fighter.elusiveRange})</Button>
                        <Button overrideClasses={`w-32 text-white ${PRSclass}`} onClick={() => onSelectMode("PRS", fighter.id)}>PRS ({fighter.pressureRange})</Button>
                    </div>
                </div>
            }
        </>
    );
};

export default ModeSelector;