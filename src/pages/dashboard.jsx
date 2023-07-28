import { ContentContainer } from "src/components/content-container";
import { DashboardBox } from "src/components/dashboard-box";
import { DashboardBoxContent } from "src/components/dashboard-box-content";
import { SectionHeading } from "src/components/section-heading";
import DashboardHeader from "src/layouts/dashboard-header";
import { PlanDetailsRecord } from "src/components/dashboard-plan-details-record";
import { DashboardSettingsRecord } from "src/components/dashboard-settings-record";
import { CtaButton } from "src/components/cta-button";
import { DashboardActionsRecord } from "src/components/dashboard-actions-record";
import videoImage from 'src/assets/images/video.png';
import webpVideoImage from 'src/assets/images/video.webp';
import routeImage from 'src/assets/images/route.png';
import webpRouteImage from 'src/assets/images/route.webp';
import { DashboardSelectButton } from "src/components/dashboard-select-button";
import { planDetailsData, dashboardActionsData, audioSpeedOptions, voiceGenderOptions, languagesData } from "src/utils/dashboard-static-data";
import { useContext, useEffect, useState } from "react";
import { authContext } from "src/context/authContext";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebase.js";
import { checkIsLoggedAndFetch } from "src/utils/utilities.js";

export default function Dashboard() {
    const [audioSpeed, setAudioSpeed] = useState('1');
    const [voiceGender, setVoiceGender] = useState('Male');
    const [TTSLanguage, setTSSLanguage] = useState("English (US)");
    const [STTLanguage, setSTTLanguage] = useState("English (US)");
    const [TTSLanguageFilter, setTTSLanguageFilter] = useState();
    const [STTLanguageFilter, setSTTLanguageFilter] = useState();
    const TTSfilterRegEx = new RegExp(TTSLanguageFilter, "i");
    const STTfilterRegEx = new RegExp(STTLanguageFilter, "i");
    const isLogged = useContext(authContext);
    const navigate = useNavigate();
    const [isPaying, setIsPaying] = useState(false);
    const [loadingState, setLoadingState] = useState(true);
    function setTTSOptionsToDefault() {
        setAudioSpeed("1");
        setVoiceGender("Male");
        setTSSLanguage("English (US)");
    }
    function setSTTOptionsToDefault() {
        setSTTLanguage("English (US)");
    }
    const filteredTTSLanguagesData = languagesData.filter(obj => TTSfilterRegEx.test(obj.optgroup));
    const filteredSTTLanguagesData = languagesData.filter(obj => STTfilterRegEx.test(obj.optgroup));

    useEffect(() => {
       
    }, [isLogged, setIsPaying]);

    return (
        <div className="dashboard">
            <DashboardHeader />
            <ContentContainer containerClass="dashboard__container">
                <SectionHeading heading="Welcome, DisplayName" />
                <ContentContainer containerClass="dashboard__container-row">
                    <DashboardBox heading="Current Plan Details">
                        <DashboardBoxContent>
                            {planDetailsData.map((item, index) => (
                                <PlanDetailsRecord heading={item.heading} images={item.images} description={item.description} imgHeight={item.imgHeight} imgWidth={item.imgWidth} key={index} />
                            ))}
                        </DashboardBoxContent>
                    </DashboardBox>
                    <DashboardBox heading="Service Usage Overview">
                        <DashboardBoxContent></DashboardBoxContent>
                    </DashboardBox>
                    <DashboardBox heading="Actions">
                        <DashboardBoxContent>
                            <DashboardActionsRecord heading="Speech And Text" actions={dashboardActionsData.slice(0, 2)} images={[webpRouteImage, routeImage]} imgWidth="42px" imgHeight="42px" alt="route" />
                            <DashboardActionsRecord heading="Videos" actions={dashboardActionsData.slice(2, 4)} images={[webpVideoImage, videoImage]} imgWidth="60px" imgHeight="42px" alt="camera" />
                        </DashboardBoxContent>
                    </DashboardBox>
                </ContentContainer>
                <ContentContainer containerClass="dashboard__container-row">
                    <DashboardBox heading="Text To Speech Settings">
                        <DashboardBoxContent>
                            <DashboardSettingsRecord description="Set To Default">
                                <CtaButton text="Set" action={setTTSOptionsToDefault} />
                            </DashboardSettingsRecord>
                            <DashboardSettingsRecord description="Set Language">
                                <DashboardSelectButton text={TTSLanguage} options={filteredTTSLanguagesData} setOption={setTSSLanguage} setFilter={setTTSLanguageFilter} />
                            </DashboardSettingsRecord>
                            <DashboardSettingsRecord description="Set Voice Speed">
                                <DashboardSelectButton text={audioSpeed} options={audioSpeedOptions} setOption={setAudioSpeed} />
                            </DashboardSettingsRecord>
                            <DashboardSettingsRecord description="Set Voice Gender">
                                <DashboardSelectButton text={voiceGender} options={voiceGenderOptions} setOption={setVoiceGender} />
                            </DashboardSettingsRecord>
                        </DashboardBoxContent>
                    </DashboardBox>
                    <DashboardBox heading="Speech To Text Settings">
                        <DashboardBoxContent>
                            <DashboardSettingsRecord description="Set To Default" >
                                <CtaButton text="Set" action={setSTTOptionsToDefault} />
                            </DashboardSettingsRecord>
                            <DashboardSettingsRecord description="Set Language">
                                <DashboardSelectButton text={STTLanguage} options={filteredSTTLanguagesData} setOption={setSTTLanguage} setFilter={setSTTLanguageFilter} />
                            </DashboardSettingsRecord>
                        </DashboardBoxContent>
                    </DashboardBox>
                </ContentContainer>
            </ContentContainer>
        </div>
    )
}