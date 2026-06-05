import useAuth from "../auth/context/AuthContext";




const Dashboard = () => {
    const {logout} = useAuth();
  
    return (
        <>
        <h1>Welcome User</h1>
        </>
    );
};

export default Dashboard;