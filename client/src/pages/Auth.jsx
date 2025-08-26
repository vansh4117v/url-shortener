import Login from "@/components/Login";
import Signup from "@/components/Signup";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/context/context";
import { TabsContent } from "@radix-ui/react-tabs";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Auth() {
  const navigate = useNavigate();
  const { isLoggedIn, loading } = useAuth();

  useEffect(() => {
    if (isLoggedIn && !loading) navigate("/");
  }, [isLoggedIn, loading, navigate]);

  return (
    <div className="my-24 flex flex-col items-center gap-10">
      <h1 className="text-4xl md:text-5xl font-extrabold">Login / Signup</h1>
      <Tabs defaultValue="login" className="w-[400px] px-10">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="signup">Signup</TabsTrigger>
        </TabsList>
        <TabsContent value="login">
          <Login />
        </TabsContent>
        <TabsContent value="signup">
          <Signup />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default Auth;
