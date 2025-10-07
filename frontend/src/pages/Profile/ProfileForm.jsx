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
    Tag,
    TagLabel,
    TagCloseButton,
    Wrap,
    WrapItem,
    Grid,
    GridItem,
    Image
  } from "@chakra-ui/react"
  import { useState } from "react"
  
  export default function ProfileForm() {
    const [formData, setFormData] = useState({
      name: "",
      email: "",
      mobile: "",
      developerType: "",
      education: "",
      github: "",
      resume: "",
      skills: []
    })
    
    const [skillInput, setSkillInput] = useState("")
    
    const handleInputChange = (e) => {
      const { name, value } = e.target
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
    
    const handleAddSkill = () => {
      const trimmedSkill = skillInput.trim()
      if (trimmedSkill && !formData.skills.includes(trimmedSkill)) {
        setFormData(prev => ({
          ...prev,
          skills: [...prev.skills, trimmedSkill]
        }))
        setSkillInput("")
      }
    }
    
    const handleRemoveSkill = (skillToRemove) => {
      setFormData(prev => ({
        ...prev,
        skills: prev.skills.filter(skill => skill !== skillToRemove)
      }))
    }
    
    const handleSubmit = () => {
      console.log("Form Data:", formData)
    }
  
    return (
      <Container maxW="container.xl" py={8}>
        <Grid templateColumns={{ base: "1fr", lg: "1fr 1.5fr" }} gap={8}>
          {/* Left Side - Image */}
          <GridItem>
            <Box 
              bg="gradient-to-br" 
              bgGradient="linear(to-br, blue.500, purple.600)"
              borderRadius="2xl"
              p={8}
              h="full"
              display="flex"
              flexDirection="column"
              justifyContent="center"
              alignItems="center"
              color="white"
              shadow="xl"
            >
              <Box mb={6}>
                <Image
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&h=600&fit=crop"
                  alt="Team collaboration"
                  borderRadius="xl"
                  boxSize="280px"
                  objectFit="cover"
                  shadow="2xl"
                />
              </Box>
              <Heading size="lg" mb={4} textAlign="center">
                Join Our Team
              </Heading>
              <Text fontSize="md" textAlign="center" opacity={0.9}>
                Complete your profile to unlock amazing career opportunities and connect with top companies.
              </Text>
            </Box>
          </GridItem>
  
          {/* Right Side - Form */}
          <GridItem>
            <Box bg="white" p={8} borderRadius="xl" shadow="lg">
              <Heading as="h1" size="xl" color="gray.800" mb={2}>
                Complete Your Profile
              </Heading>
              <Text color="gray.600" mb={6}>
                Fill in your details to get started
              </Text>
  
              <VStack spacing={5} align="stretch">
                {/* Name */}
                <FormControl isRequired>
                  <FormLabel color="gray.700" fontWeight="600" fontSize="sm">
                    Full Name
                  </FormLabel>
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    size="md"
                    borderRadius="md"
                    focusBorderColor="blue.500"
                  />
                </FormControl>
  
                {/* Email */}
                <FormControl isRequired>
                  <FormLabel color="gray.700" fontWeight="600" fontSize="sm">
                    Email Address
                  </FormLabel>
                  <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="your.email@example.com"
                    size="md"
                    borderRadius="md"
                    focusBorderColor="blue.500"
                  />
                </FormControl>
  
                {/* Mobile Number */}
                <FormControl isRequired>
                  <FormLabel color="gray.700" fontWeight="600" fontSize="sm">
                    Mobile Number
                  </FormLabel>
                  <Input
                    type="tel"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleInputChange}
                    placeholder="+91 98765 43210"
                    size="md"
                    borderRadius="md"
                    focusBorderColor="blue.500"
                  />
                </FormControl>
  
                {/* Developer Type */}
                <FormControl isRequired>
                  <FormLabel color="gray.700" fontWeight="600" fontSize="sm">
                    Developer Type
                  </FormLabel>
                  <Select
                    name="developerType"
                    value={formData.developerType}
                    onChange={handleInputChange}
                    placeholder="Select developer type"
                    size="md"
                    borderRadius="md"
                    focusBorderColor="blue.500"
                  >
                    <option value="frontend">Frontend Developer</option>
                    <option value="backend">Backend Developer</option>
                    <option value="fullstack">Full Stack Developer</option>
                    <option value="mobile">Mobile Developer</option>
                    <option value="devops">DevOps Engineer</option>
                    <option value="qa">QA Engineer</option>
                  </Select>
                </FormControl>
  
                {/* Education */}
                <FormControl isRequired>
                  <FormLabel color="gray.700" fontWeight="600" fontSize="sm">
                    Education
                  </FormLabel>
                  <Textarea
                    name="education"
                    value={formData.education}
                    onChange={handleInputChange}
                    placeholder="E.g., B.Tech in Computer Science from XYZ University (2020)"
                    size="md"
                    borderRadius="md"
                    focusBorderColor="blue.500"
                    rows={2}
                  />
                </FormControl>
  
                {/* GitHub */}
                <FormControl>
                  <FormLabel color="gray.700" fontWeight="600" fontSize="sm">
                    GitHub Profile
                  </FormLabel>
                  <Input
                    type="url"
                    name="github"
                    value={formData.github}
                    onChange={handleInputChange}
                    placeholder="https://github.com/yourusername"
                    size="md"
                    borderRadius="md"
                    focusBorderColor="blue.500"
                  />
                </FormControl>
  
                {/* Resume */}
                <FormControl isRequired>
                  <FormLabel color="gray.700" fontWeight="600" fontSize="sm">
                    Resume URL
                  </FormLabel>
                  <Input
                    type="url"
                    name="resume"
                    value={formData.resume}
                    onChange={handleInputChange}
                    placeholder="https://drive.google.com/your-resume-link"
                    size="md"
                    borderRadius="md"
                    focusBorderColor="blue.500"
                  />
                </FormControl>
  
                {/* Skills - Todo Style */}
                <FormControl isRequired>
                  <FormLabel color="gray.700" fontWeight="600" fontSize="sm">
                    Skills
                  </FormLabel>
                  
                  <HStack mb={3}>
                    <Input
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          handleAddSkill()
                        }
                      }}
                      placeholder="Add a skill (e.g., React, Node.js, QA Testing)"
                      size="md"
                      borderRadius="md"
                      focusBorderColor="blue.500"
                    />
                    <Button
                      onClick={handleAddSkill}
                      colorScheme="blue"
                      size="md"
                      px={6}
                      isDisabled={!skillInput.trim()}
                    >
                      Add
                    </Button>
                  </HStack>
  
                  {/* Selected Skills List */}
                  {formData.skills.length > 0 && (
                    <Box 
                      p={4} 
                      bg="gray.50" 
                      borderRadius="md"
                      borderWidth="1px"
                      borderColor="gray.200"
                      maxH="200px"
                      overflowY="auto"
                    >
                      <Text fontSize="sm" color="gray.700" fontWeight="600" mb={3}>
                        Your Skills ({formData.skills.length})
                      </Text>
                      <VStack spacing={2} align="stretch">
                        {formData.skills.map((skill, index) => (
                          <HStack
                            key={skill}
                            p={3}
                            bg="white"
                            borderRadius="md"
                            justify="space-between"
                            borderWidth="1px"
                            borderColor="gray.200"
                            _hover={{ borderColor: "blue.300", shadow: "sm" }}
                            transition="all 0.2s"
                          >
                            <HStack spacing={3}>
                              <Box
                                bg="blue.500"
                                color="white"
                                fontWeight="bold"
                                fontSize="xs"
                                w={6}
                                h={6}
                                borderRadius="md"
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                              >
                                {index + 1}
                              </Box>
                              <Text fontSize="sm" fontWeight="500" color="gray.800">
                                {skill}
                              </Text>
                            </HStack>
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
                    </Box>
                  )}
  
                  {formData.skills.length === 0 && (
                    <Box 
                      p={4} 
                      bg="gray.50" 
                      borderRadius="md"
                      borderWidth="1px"
                      borderColor="gray.200"
                      textAlign="center"
                    >
                      <Text fontSize="sm" color="gray.500">
                        No skills added yet. Add your first skill above!
                      </Text>
                    </Box>
                  )}
                </FormControl>
  
                {/* Submit Button */}
                <Button
                  onClick={handleSubmit}
                  colorScheme="blue"
                  size="lg"
                  w="full"
                  borderRadius="md"
                  py={6}
                  fontSize="md"
                  fontWeight="600"
                  _hover={{ transform: "translateY(-2px)", shadow: "lg" }}
                  transition="all 0.2s"
                  mt={4}
                >
                  Save Profile
                </Button>
              </VStack>
            </Box>
          </GridItem>
        </Grid>
      </Container>
    )
  }