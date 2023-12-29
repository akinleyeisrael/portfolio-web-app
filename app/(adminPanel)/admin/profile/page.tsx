import { authOptions } from "@/app/auth/authOptions";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import prisma from "@/lib/client";
import { User, getServerSession } from "next-auth";
import { DeleteUserButton, ProfileForm, RegistrationUserForm } from "./Form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

const Profile = async () => {
  const session = await getServerSession(authOptions);

  const isAdmin = session && session.user?.role == "admin";

  const userCred = await prisma.user.findUnique({
    where: {
      email: session?.user?.email!,
    },
  });

  const users = await prisma.user.findMany({
    orderBy: {
      updatedAt: "desc"
    },
  });

  return (
    <div className="mx-auto max-w-sm items-center space-y-3 pt-20 px-8">
      <h1 className="font-bold text-2xl">Profile</h1>
      <div>
        <Tabs defaultValue="account" className="w-full">
          <TabsList className="grid w-full grid-cols-2 ">
            <TabsTrigger value="account">Profile</TabsTrigger>
            <TabsTrigger value="password">Account</TabsTrigger>
          </TabsList>
          <TabsContent value="account">
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle>Account profile</CardTitle>
                <CardDescription>Your account profile</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div>
                    <Label>Username</Label>
                    <Separator className="pb-2" />
                    <p>{userCred?.userName}</p>
                  </div>
                  <div>
                    <Label>Email</Label>
                    <Separator className="pb-2" />
                    <p>{userCred?.email}</p>
                  </div>
                  <div>
                    <Label>Role</Label>
                    <Separator className="pb-2" />
                    <p>{session?.user?.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="password">
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle>Account</CardTitle>
                <CardDescription>
                  Make changes to your account here. Click save when you re
                  done. After saving, you ll be logged out.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ProfileForm user={userCred!} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {isAdmin && (
        <div className="space-y-5 py-10">
          <h1 className="font-bold">User accounts</h1>
          <RegistrationUserForm />
          {users.map((user) => (
            <Card key={user.id} className="shadow-md">
              <DeleteUserButton id={user.id} />
              <CardHeader>User</CardHeader>
              <CardContent>
                <div className="bg-red-300 text-black rounded font-bold">
                  Username: {user.userName}
                </div>
                <div className="bg-green-300 text-black rounded font-bold">
                  Email: {user.email}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Profile;
