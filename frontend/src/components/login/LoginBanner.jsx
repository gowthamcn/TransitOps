import { Truck, MapPinned, Wrench, Fuel } from "lucide-react";

const features = [
  {
    icon: Truck,
    text: "Fleet Tracking",
  },
  {
    icon: MapPinned,
    text: "Live Trip Monitoring",
  },
  {
    icon: Wrench,
    text: "Maintenance Scheduling",
  },
  {
    icon: Fuel,
    text: "Fuel Analytics",
  },
];

const LoginBanner = () => {
  return (
    <div className="hidden lg:flex flex-col justify-between bg-gradient-to-br from-cyan-600 to-blue-700 p-12 text-white">

      <div>

        <div className="flex items-center gap-4">

          <div className="bg-white/20 p-4 rounded-2xl">
            <Truck size={40} />
          </div>

          <div>

            <h1 className="text-5xl font-bold">
              TransitOps
            </h1>

            <p className="text-cyan-100 mt-2">
              Smart Fleet Management Platform
            </p>

          </div>

        </div>

      </div>

      <div className="space-y-6">

        {features.map((item, index) => {
          const Icon = item.icon;

          return (
            <div
              key={index}
              className="flex items-center gap-4"
            >
              <Icon size={24} />

              <span className="text-lg">
                {item.text}
              </span>
            </div>
          );
        })}

      </div>

      <div>

        <p className="text-cyan-100">
          Version 1.0
        </p>

      </div>

    </div>
  );
};

export default LoginBanner;