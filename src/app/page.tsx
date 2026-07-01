import { Button } from "@/components/ui/button";
import prisma from "@/lib/db";

const Page = async () => {

  return (
    <div className="min-h-screen
      min-w-screen flex items-center
      justify-center">
      <Button>
      Click me
      </Button>
    </div>
  );
};

export default Page;