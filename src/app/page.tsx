import { ProfileParserForm } from "@/components/ProfileParserForm";
import { Typography, Layout } from "antd";

const { Title } = Typography;
const { Content } = Layout;

export default function Home() {
  return (
    <Layout style={{ minHeight: "100vh" }}>

        <ProfileParserForm />

    </Layout>
  );
}
