import React, { useState } from "react";
import {
  Box,
  Heading,
  Text,
  VStack,
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
  Button,
  Checkbox,
  HStack,
  Tag,
  TagLabel,
  TagCloseButton,
  SimpleGrid,
  Divider,
  useToast,
  Icon,
  InputGroup,
  InputLeftElement,
} from "@chakra-ui/react";
import { FiBriefcase, FiMapPin, FiDollarSign, FiPlus } from "react-icons/fi";
import { FaBuilding } from "react-icons/fa";

function CreateJobPost() {
  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState("");
  const [formData, setFormData] = useState({});
  const toast = useToast();

  const addSkill = () => {
    if (skillInput && !skills.includes(skillInput)) {
      setSkills([...skills, skillInput]);
      setSkillInput("");
    }
  };

  const removeSkill = (skill) => {
    setSkills(skills.filter((s) => s !== skill));
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (!formData.title || !formData.company || !formData.description) {
      toast({
        title: "Please fill all required fields",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    toast({
      title: "Job Post Published!",
      description: `${formData.title} at ${formData.company}`,
      status: "success",
      duration: 3000,
      isClosable: true,
    });

    console.log("Form Submitted:", { ...formData, skills });
  };

  return (
    <Box p={6} bg="gray.50" minH="100vh">
      <Box bg="white" p={8} rounded="2xl" shadow="sm" mx="auto" maxW="5xl" borderWidth="1px" borderColor="gray.100">
        {/* Header */}
        <Box mb={8}>
          <Heading as="h1" size="xl" mb={2} color="gray.800" fontWeight="bold">
            Create Job Post
          </Heading>
          <Text fontSize="md" color="gray.600">
            Fill in the details below to create a new job posting.
          </Text>
        </Box>

        <VStack spacing={6} align="stretch">
          {/* Job Title + Company */}
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
            <FormControl isRequired>
              <FormLabel color="gray.700" fontWeight="medium">Job Title</FormLabel>
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <Icon as={FiBriefcase} color="gray.400" />
                </InputLeftElement>
                <Input
                  name="title"
                  placeholder="e.g., Software QA Engineer"
                  onChange={handleChange}
                  rounded="lg"
                  _focus={{ borderColor: "blue.400", boxShadow: "0 0 0 1px #4299E1" }}
                />
              </InputGroup>
            </FormControl>
            <FormControl isRequired>
              <FormLabel color="gray.700" fontWeight="medium">Company Name</FormLabel>
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <Icon as={FaBuilding} color="gray.400" />
                </InputLeftElement>
                <Input
                  name="company"
                  placeholder="e.g., Oscorp"
                  onChange={handleChange}
                  rounded="lg"
                  _focus={{ borderColor: "blue.400", boxShadow: "0 0 0 1px #4299E1" }}
                />
              </InputGroup>
            </FormControl>
          </SimpleGrid>

          {/* Location + Salary */}
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
            <FormControl>
              <FormLabel color="gray.700" fontWeight="medium">Location</FormLabel>
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <Icon as={FiMapPin} color="gray.400" />
                </InputLeftElement>
                <Input 
                  name="location" 
                  placeholder="e.g., San Diego, CA" 
                  onChange={handleChange}
                  rounded="lg"
                  _focus={{ borderColor: "blue.400", boxShadow: "0 0 0 1px #4299E1" }}
                />
              </InputGroup>
            </FormControl>
            <FormControl>
              <FormLabel color="gray.700" fontWeight="medium">Salary</FormLabel>
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <Icon as={FiDollarSign} color="gray.400" />
                </InputLeftElement>
                <Input 
                  name="salary" 
                  placeholder="e.g., $90k - $110k" 
                  onChange={handleChange}
                  rounded="lg"
                  _focus={{ borderColor: "blue.400", boxShadow: "0 0 0 1px #4299E1" }}
                />
              </InputGroup>
            </FormControl>
          </SimpleGrid>

          {/* Work Mode + Job Type */}
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
            <FormControl>
              <FormLabel color="gray.700" fontWeight="medium">Work Mode</FormLabel>
              <Select 
                name="workMode" 
                placeholder="Select work mode" 
                onChange={handleChange}
                rounded="lg"
                _focus={{ borderColor: "blue.400", boxShadow: "0 0 0 1px #4299E1" }}
              >
                <option>On-site</option>
                <option>Remote</option>
                <option>Hybrid</option>
              </Select>
            </FormControl>
            <FormControl>
              <FormLabel color="gray.700" fontWeight="medium">Job Type</FormLabel>
              <Select 
                name="jobType" 
                placeholder="Select job type" 
                onChange={handleChange}
                rounded="lg"
                _focus={{ borderColor: "blue.400", boxShadow: "0 0 0 1px #4299E1" }}
              >
                <option>Full-time</option>
                <option>Part-time</option>
                <option>Contract</option>
                <option>Internship</option>
              </Select>
            </FormControl>
          </SimpleGrid>

          {/* Language + Experience */}
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
            <FormControl>
              <FormLabel color="gray.700" fontWeight="medium">Language</FormLabel>
              <Input 
                name="language" 
                placeholder="e.g., English" 
                onChange={handleChange}
                rounded="lg"
                _focus={{ borderColor: "blue.400", boxShadow: "0 0 0 1px #4299E1" }}
              />
            </FormControl>
            <FormControl>
              <FormLabel color="gray.700" fontWeight="medium">Experience Required</FormLabel>
              <Input 
                name="experience" 
                placeholder="e.g., 2-4 years" 
                onChange={handleChange}
                rounded="lg"
                _focus={{ borderColor: "blue.400", boxShadow: "0 0 0 1px #4299E1" }}
              />
            </FormControl>
          </SimpleGrid>

          {/* Education + Openings */}
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
            <FormControl>
              <FormLabel color="gray.700" fontWeight="medium">Education</FormLabel>
              <Input
                name="education"
                placeholder="e.g., Bachelor's in Computer Science"
                onChange={handleChange}
                rounded="lg"
                _focus={{ borderColor: "blue.400", boxShadow: "0 0 0 1px #4299E1" }}
              />
            </FormControl>
            <FormControl>
              <FormLabel color="gray.700" fontWeight="medium">No. of Openings</FormLabel>
              <Input 
                name="openings" 
                placeholder="e.g., 2" 
                type="number" 
                onChange={handleChange}
                rounded="lg"
                _focus={{ borderColor: "blue.400", boxShadow: "0 0 0 1px #4299E1" }}
              />
            </FormControl>
          </SimpleGrid>

          <Divider my={2} />

          {/* Skills */}
          <FormControl>
            <FormLabel color="gray.700" fontWeight="medium">Skills</FormLabel>
            <HStack>
              <Input
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                placeholder="e.g., Test Automation"
                rounded="lg"
                _focus={{ borderColor: "blue.400", boxShadow: "0 0 0 1px #4299E1" }}
                onKeyPress={(e) => e.key === "Enter" && addSkill()}
              />
              <Button 
                onClick={addSkill} 
                colorScheme="blue"
                leftIcon={<FiPlus />}
                rounded="lg"
                px={6}
                _focus={{ boxShadow: "none" }}
              >
                Add
              </Button>
            </HStack>
            <HStack mt={3} wrap="wrap" spacing={2}>
              {skills.map((skill, idx) => (
                <Tag key={idx} colorScheme="blue" borderRadius="full" px={4} py={2} size="md">
                  <TagLabel fontWeight="medium">{skill}</TagLabel>
                  <TagCloseButton onClick={() => removeSkill(skill)} />
                </Tag>
              ))}
            </HStack>
          </FormControl>

          {/* Benefits */}
          <FormControl>
            <FormLabel color="gray.700" fontWeight="medium">Benefits</FormLabel>
            <Textarea
              name="benefits"
              placeholder="e.g., Health Insurance, Annual Bonus, Training Budget"
              onChange={handleChange}
              rounded="lg"
              _focus={{ borderColor: "blue.400", boxShadow: "0 0 0 1px #4299E1" }}
              rows={3}
            />
          </FormControl>

          {/* Description */}
          <FormControl isRequired>
            <FormLabel color="gray.700" fontWeight="medium">Job Description</FormLabel>
            <Textarea
              name="description"
              placeholder="Describe the job responsibilities and requirements..."
              rows={6}
              onChange={handleChange}
              rounded="lg"
              _focus={{ borderColor: "blue.400", boxShadow: "0 0 0 1px #4299E1" }}
            />
          </FormControl>

          {/* Checkboxes */}
          <HStack spacing={8} pt={2}>
            <Checkbox 
              name="aiInterview" 
              onChange={handleChange}
              colorScheme="blue"
              size="lg"
            >
              <Text fontWeight="medium" color="gray.700">AI Interview Available</Text>
            </Checkbox>
            <Checkbox 
              name="easyApply" 
              onChange={handleChange}
              colorScheme="blue"
              size="lg"
            >
              <Text fontWeight="medium" color="gray.700">Easy Apply</Text>
            </Checkbox>
          </HStack>

          {/* Submit */}
          <Box textAlign="right" pt={4}>
            <Button 
              colorScheme="blue" 
              size="lg" 
              onClick={handleSubmit}
              px={10}
              rounded="lg"
              _focus={{ boxShadow: "none" }}
              shadow="sm"
            >
              Publish Job
            </Button>
          </Box>
        </VStack>
      </Box>
    </Box>
  );
}

export default CreateJobPost;