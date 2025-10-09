import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  Select,
  Textarea,
  Container,
  Text,
  HStack,
  Image,
  useToast,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { appRequest } from "../../Routes/backendRutes";

export default function ProfileForm() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    mobileNumber: "",
    developerType: "",
    education: "",
    githubProfile: "",
    resumeUrl: "",
    skills: [],
  });

  const [skillInput, setSkillInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isProfileExist, setIsProfileExist] = useState(false);
  const [profileId, setProfileId] = useState(null);
  const toast = useToast();

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Add new skill
  const handleAddSkill = () => {
    const trimmedSkill = skillInput.trim();
    if (trimmedSkill && !formData.skills.includes(trimmedSkill)) {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, trimmedSkill],
      }));
      setSkillInput("");
    }
  };

  // Remove skill
  const handleRemoveSkill = (skillToRemove) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((skill) => skill !== skillToRemove),
    }));
  };

  // Submit or update profile
  const handleSubmit = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("auth-token");
      if (!token) {
        toast({
          title: "Authentication Error",
          description: "Please log in to update your profile.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        setLoading(false);
        return;
      }

      const payload = { ...formData };
      let response;

      if (isProfileExist) {
        // Update existing profile
        response = await appRequest("userAccount", "updateAccount", {
          ...payload,
          id: profileId,
        });
      } else {
        // Create new profile
        response = await appRequest("userAccount", "createAccount", payload);
      }

      toast({
        title: "Profile saved successfully!",
        description: "Your profile has been saved.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      if (response && response._id) {
        setProfileId(response._id);
        setIsProfileExist(true);
      }
    } catch (error) {
      toast({
        title: "Error updating profile.",
        description: error.message || "Something went wrong.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch user profile if exists
  useEffect(() => {
    const fetchUserProfile = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("auth-token");
        if (!token) {
          toast({
            title: "Authentication Error",
            description: "Please log in to view your profile.",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
          setLoading(false);
          return;
        }

        const response = await appRequest("userAccount", "getAccountById");
        const userData = Array.isArray(response) ? response[0] : response;

        setFormData({
          fullName: userData.fullName || "",
          email: userData.email || "",
          mobileNumber: userData.mobileNumber || "",
          developerType: userData.developerType || "",
          education: userData.education || "",
          githubProfile: userData.githubProfile || "",
          resumeUrl: userData.resumeUrl || "",
          skills: Array.isArray(userData.skills) ? userData.skills : [],
        });
        if (userData && userData._id) {
          setProfileId(userData._id);
          setIsProfileExist(true);
        } else {
          setIsProfileExist(false);
        }
      } catch (error) {
        toast({
          title: "Error fetching profile.",
          description: error.message || "Failed to load profile data.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [toast]);

  return (
    <Container maxW="container.xl" py={8}>
      <Heading as="h1" size="xl" color="gray.800" mb={4}>
        {isProfileExist ? "Edit Your Profile" : "Complete Your Profile"}
      </Heading>

      <VStack spacing={5} align="stretch" bg="white" p={8} borderRadius="xl" shadow="lg">
        {/* Full Name */}
        <FormControl isRequired>
          <FormLabel>Full Name</FormLabel>
          <Input
            name="fullName"
            value={formData.fullName}
            onChange={handleInputChange}
            placeholder="Enter your full name"
          />
        </FormControl>

        {/* Email */}
        <FormControl isRequired>
          <FormLabel>Email Address</FormLabel>
          <Input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="your.email@example.com"
          />
        </FormControl>

        {/* Mobile Number */}
        <FormControl isRequired>
          <FormLabel>Mobile Number</FormLabel>
          <Input
            type="tel"
            name="mobileNumber"
            value={formData.mobileNumber}
            onChange={handleInputChange}
            placeholder="+91 98765 43210"
          />
        </FormControl>

        {/* Developer Type */}
        <FormControl isRequired>
          <FormLabel>Developer Type</FormLabel>
          <Select
            name="developerType"
            value={formData.developerType}
            onChange={handleInputChange}
            placeholder="Select developer type"
          >
            <option value="Frontend Developer">Frontend Developer</option>
            <option value="Backend Developer">Backend Developer</option>
            <option value="Full Stack Developer">Full Stack Developer</option>
            <option value="Mobile App Developer">Mobile App Developer</option>
            <option value="DevOps Engineer">DevOps Engineer</option>
            <option value="Data Scientist">Data Scientist</option>
            <option value="Other">Other</option>
          </Select>
        </FormControl>

        {/* Education */}
        <FormControl isRequired>
          <FormLabel>Education</FormLabel>
          <Textarea
            name="education"
            value={formData.education}
            onChange={handleInputChange}
            placeholder="E.g., B.Tech in Computer Science from XYZ University (2020)"
          />
        </FormControl>

        {/* GitHub Profile */}
        <FormControl>
          <FormLabel>GitHub Profile</FormLabel>
          <Input
            type="url"
            name="githubProfile"
            value={formData.githubProfile}
            onChange={handleInputChange}
            placeholder="https://github.com/yourusername"
          />
        </FormControl>

        {/* Resume */}
        <FormControl isRequired>
          <FormLabel>Resume URL</FormLabel>
          <Input
            type="url"
            name="resumeUrl"
            value={formData.resumeUrl}
            onChange={handleInputChange}
            placeholder="https://drive.google.com/your-resume-link"
          />
        </FormControl>

        {/* Skills */}
        <FormControl isRequired>
          <FormLabel>Skills</FormLabel>
          <HStack mb={3}>
            <Input
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              placeholder="Add a skill (e.g., React, Node.js)"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddSkill();
                }
              }}
            />
            <Button onClick={handleAddSkill} colorScheme="blue" isDisabled={!skillInput.trim()}>
              Add
            </Button>
          </HStack>

          {formData.skills.length > 0 ? (
            <VStack align="start" spacing={2}>
              {formData.skills.map((skill, index) => (
                <HStack
                  key={index}
                  p={2}
                  borderWidth="1px"
                  borderRadius="md"
                  justify="space-between"
                  w="full"
                >
                  <Text>{skill}</Text>
                  <Button
                    size="xs"
                    variant="ghost"
                    colorScheme="red"
                    onClick={() => handleRemoveSkill(skill)}
                  >
                    Remove
                  </Button>
                </HStack>
              ))}
            </VStack>
          ) : (
            <Text fontSize="sm" color="gray.500">
              No skills added yet.
            </Text>
          )}
        </FormControl>

        {/* Submit Button */}
        <Button
          onClick={handleSubmit}
          colorScheme="blue"
          size="lg"
          w="full"
          isLoading={loading}
        >
          {isProfileExist ? "Update Profile" : "Save Profile"}
        </Button>
      </VStack>
    </Container>
  );
}
