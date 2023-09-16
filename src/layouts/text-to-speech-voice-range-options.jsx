import { RangeAdjust } from "src/components/dashboard/rangeAdjust";

export default function TTSVoiceRanges({ranges}) {
    return (
        <div className="tts-voice-ranges">
            {ranges.map((range,index) => (
                <RangeAdjust heading={range.heading} leftTooltip={{heading:range.leftTooltip.heading,description:range.leftTooltip.description}} rightTooltip={{heading:range.rightTooltip.heading,description:range.rightTooltip.description}} key={index} name={range.name} setValue={range.setValue} value={range.value}/>
            ))}
        </div>
    )
}