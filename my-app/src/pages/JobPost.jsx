import React from "react";
import {
  Box,
  Flex,
  Text,
  Input,
  Button,
  Select,
  HStack,
  Divider,
  Badge,
} from "@chakra-ui/react";
import { FaSearch, FaStar } from "react-icons/fa";

const jobs = [
  {
    id: 1,
    title: "Jio Customer Associate - Freelancer JC",
    company: "Reliance Jio Infocomm Limited",
    location: "Jail Road, Delhi, Delhi",
    type: "Freelance",
    urgent: false,
    description: `Capture customer details and data relevant to the call or service. 
Assist the customers in completing Jio Recharge. 
Ensure a delightful customer experience.`,
  },
  {
    id: 2,
    title: "Web Researcher",
    company: "Anupam Royals",
    location: "Delhi, Delhi",
    type: "Full-time",
    salary: "₹30,000 - ₹35,000 a month",
    urgent: false,
    description:
      "0–2 years of experience in data research / web research / lead generation (freshers can also apply). Growth opportunities in the research and business…",
  },
  {
    id: 3,
    title: "Web Designer",
    company: "WebMartIndia",
    location: "Pitampura, Delhi, Delhi",
    type: "Full-time",
    salary: "₹15,000 - ₹20,000 a month",
    urgent: false,
    description:
      "Bachelor's degree in web design, graphic design, or a related field. Excellent visual design skills with an eye for typography, color, and layout.",
  },
  {
    id: 4,
    title: "Web Designer",
    company: "Weblive Solution .Net",
    location: "Delhi, Delhi",
    type: "Full-time",
    salary: "Up to ₹15,000 a month",
    urgent: false,
    description:
      "As a Web Designer you will be responsible to work on client’s requirement and assessing their needs to create and maintain their website and products.",
  },
  {
    id: 5,
    title: "Website Designer",
    company: "RKJ Electric",
    location: "Rohini, Delhi, Delhi",
    salary: "₹20,058.57 - ₹25,868.11 a month",
    type: "Full-time",
    urgent: false,
    description:
      "Creativity and an eye for clean, modern design. Knowledge of HTML, CSS, JavaScript, and responsive web design. Understanding of UI/UX principles is a plus.",
  },
  {
    id: 6,
    title: "Tourism Professional - AI Trainer",
    company: "DataAnnotation",
    location: "Delhi, Delhi",
    type: "Contractual / Temporary",
    salary: "From ₹1,932.55 an hour",
    urgent: true,
    rating: 3.7,
    description:
      "We are looking for a bilingual professional to join our team and teach AI chatbots. You will have conversations in both Hindi and English with chatbots in…",
  },
  {
    id: 7,
    title: "Fashion Assistant",
    company: "ONTOBYAANCHAL",
    location: "Kirti Nagar, Delhi, Delhi",
    type: "Permanent",
    salary: "₹15,000 - ₹18,000 a month",
    urgent: false,
    description:
      "Assist in daily office operations. Coordinate the dispatch for ecommerce orders. Proficiency in basic computer skills. Prior experience in fashion or retail.",
  },
  {
    id: 8,
    title: "2D Visualiser",
    company: "ANSA Interiors",
    location: "Delhi, Delhi",
    type: "Full-time",
    salary: "₹18,000 - ₹30,000 a month",
    urgent: false,
    description:
      "Develop detailed floor plans, working and section drawings, design documentation using AutoCAD and. Stay updated with industry trends and materials.",
  },
  {
    id: 9,
    title: "Home Loans Officer",
    company: "Pegasus Mortgage Lending",
    location: "Delhi, Delhi",
    type: "Full-time",
    salary: "₹5,00,000 - ₹12,00,000 a year",
    urgent: false,
    description:
      "Reporting directly to our Team Lead Sales and Development along with our Operations Director, you will be responsible to develop a premiere sales culture.",
  },
];



const Filters = () => (
  <HStack p={3} spacing={3} bg="gray.50" borderBottom="1px solid #ddd">
    <Select placeholder="Pay" w="150px" />
    <Select placeholder="Remote" w="150px" />
    <Select placeholder="Within 25 km" w="180px" />
    <Select placeholder="Company" w="150px" />
    <Select placeholder="Job type" w="150px" />
    <Select placeholder="Job language" w="150px" />
    <Select placeholder="Skills" w="150px" />
  </HStack>
);
const JobCard = ({ job, onClick }) => (
  <Box
    borderWidth="1px"
    borderRadius="md"
    p={5}
    mb={4}
    bg="white"
    cursor="pointer"
    _hover={{ shadow: "md", borderColor: "blue.400" }}
    onClick={() => onClick(job)}
  >
    <Flex direction="column" gap={2}>
      {/* Company */}
      <Text fontSize="sm" fontWeight="semibold" color="gray.600">
        {job.company}
      </Text>

      {/* Job Title */}
      <Text fontSize="lg" fontWeight="bold" color="blue.600">
        {job.title}
      </Text>

      {/* Location + Type + Salary */}
      <Text fontSize="sm" color="gray.700">
        {job.location} • {job.type} {job.salary && `• ${job.salary}`}
      </Text>

      {/* Description (truncated) */}
      <Text fontSize="sm" mt={1} noOfLines={2} color="gray.600">
        {job.description}
      </Text>

      {/* Tags & Rating */}
      <HStack mt={2} spacing={3}>
        {job.urgent && (
          <Badge colorScheme="red" variant="subtle">
            Urgently hiring
          </Badge>
        )}
        {job.easyApply && (
          <Badge colorScheme="green" variant="subtle">
            Easily apply
          </Badge>
        )}
        {job.rating && (
          <HStack spacing={1}>
            <FaStar color="#F6E05E" />
            <Text fontSize="sm">{job.rating}</Text>
          </HStack>
        )}
      </HStack>
    </Flex>
  </Box>
);


const JobList = ({ jobs, onSelect }) => (
  <Box p={4} w="40%" borderRight="1px solid #ddd" h="calc(100vh - 120px)" overflowY="auto">
    {jobs.map((job) => (
      <JobCard key={job.id} job={job} onClick={onSelect} />
    ))}
  </Box>
);

const JobDetail = ({ job }) => (
  <Box p={6} w="60%" h="calc(100vh - 120px)" overflowY="auto" bg="white">
    {/* Job Title */}
    <Text fontSize="2xl" fontWeight="bold" mb={2}>
      {job.title}
    </Text>

    {/* Company + Rating */}
    <HStack spacing={2} mb={1}>
      <Text fontSize="md" fontWeight="semibold" color="blue.600">
        {job.company}
      </Text>
      {job.rating && (
        <HStack spacing={1}>
          <FaStar color="#F6E05E" />
          <Text fontSize="sm">{job.rating}</Text>
        </HStack>
      )}
    </HStack>

    {/* Location + Type + Salary */}
    <Text fontSize="sm" color="gray.600" mb={3}>
      {job.location} • {job.type} {job.salary && `• ${job.salary}`}
    </Text>

    {/* Apply Button */}
    <Button mt={2} colorScheme="blue" size="md">
      Apply on company site
    </Button>

    {/* Divider */}
    <Divider my={5} />

    {/* Job Description */}
    <Box>
      <Text fontSize="md" whiteSpace="pre-line">
        {job.description}
      </Text>
    </Box>

    {/* Extra Links like Indeed */}
    <Divider my={6} />
    <Box>
      <Text fontSize="sm" color="blue.600" cursor="pointer" _hover={{ textDecor: "underline" }}>
        View all {job.company} jobs – {job.location}
      </Text>
      {job.salary && (
        <Text fontSize="sm" color="blue.600" cursor="pointer" _hover={{ textDecor: "underline" }}>
          Salary Search: {job.title} salaries in {job.location}
        </Text>
      )}
    </Box>
  </Box>
);


export default function JobPost() {
  const [selectedJob, setSelectedJob] = React.useState(jobs[0]);

  return (
    <Box>
      <Filters />
      <Flex>
        <JobList jobs={jobs} onSelect={setSelectedJob} />
        <JobDetail job={selectedJob} />
      </Flex>
    </Box>
  );
}