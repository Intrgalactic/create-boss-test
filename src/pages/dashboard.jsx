import { ContentContainer } from "src/components/content-container";
import { DashboardBox } from "src/components/dashboard-box";
import { DashboardBoxRecord } from "src/components/dashboard-box-record";
import DashboardHeader from "src/layouts/dashboard-header";

export default function Dashboard() {
    return (
        <div className="dashboard">
            <DashboardHeader />
            <ContentContainer containerClass="dashboard__container">
                <ContentContainer containerClass="dashboard__container-row">
                    <DashboardBox heading="Current Plan Details">
                        <DashboardBoxRecord></DashboardBoxRecord>
                    </DashboardBox>
                    <DashboardBox heading="Service Usage Overview">

                    </DashboardBox>
                    <DashboardBox heading="Actions">

                    </DashboardBox>
                </ContentContainer>
            </ContentContainer>
        </div>
    )
}