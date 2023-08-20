
export function CustomTooltip({ payload, label, active }) {
    const colors = [ "#ffb200", "#e000ff", "#7800ff", "#0059ff"];
    if (payload.length > 0) {
 
        var dataArr = [{
            key: payload[0].dataKey,
            value: payload[0].value
        }, {
            key: payload[1].dataKey,
            value: payload[1].value
        },
        {
            key: payload[2].dataKey,
            value: payload[2].value
        }, {
            key: payload[3].dataKey,
            value: payload[3].value
        }];
        dataArr.sort(function (a, b) {
            return b.value - a.value; // Ascending order
            // To sort in descending order, use: return b.value - a.value;
        });
    }
    if (active) {
        return (
            <div className="dashboard-tooltip">
                {dataArr.map((obj, index) => (
                    <p className="dashboard-tooltip-label" style={{color: obj.key === "STT" ? colors[3] : obj.key === "TTS" ? colors[2] : obj.key === "STV" ? colors[1] : colors[0]}} key={index}>{obj.key} {<span style={{color:"white"}}>{obj.value} Minutes</span>}</p>
                ))}
            </div>
        );
    }

    return null;
}