import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

const Announcements = () => {
  return (
    <Card className=" py-4 bg-muted rounded-md">
      <CardHeader className="flex px-4 items-center justify-between">
        <CardTitle className="text-xl font-semibold">Announcements</CardTitle>
        <span className="text-xs text-muted-foreground">View All</span>
      </CardHeader>
      <CardContent className="flex px-4 flex-col gap-4 mt-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="odd:bg-purple-300 even:bg-yellow-300 rounded-md p-4"
          >
            <div className="flex items-center justify-between">
              <h2 className="font-medium text-primary">
                Lorem ipsum dolor sit
              </h2>
              <span className="text-xs text-primary bg-secondary rounded-md p-1">
                2025-01-01
              </span>
            </div>
            <p className="text-sm text-primary mt-1">
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Voluptatum, expedita. Rerum, quidem facilis?
            </p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default Announcements;
