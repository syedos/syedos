import profilePic from "@/assets/syedos.png";

const AnimatedIcon = () => {
  return (
    <div className="w-10 h-10 rounded-full overflow-hidden border border-border">
      <img src={profilePic} alt="syedOS" className="w-full h-full object-cover" />
    </div>
  );
};

export default AnimatedIcon;
