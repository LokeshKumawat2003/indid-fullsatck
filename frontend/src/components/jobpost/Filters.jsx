import { HStack, Select } from "@chakra-ui/react";

const filterOptions = [
  { placeholder: "Pay", width: "150px", values: ["$50k+", "$100k+", "$150k+"] },
  { placeholder: "Remote", width: "150px", values: ["Remote", "Hybrid", "On-site"] },
  { placeholder: "Within 25 km", width: "180px", values: ["10 km", "25 km", "50 km", "100 km"] },
  { placeholder: "Company", width: "150px", values: ["Acme Corp", "Globex", "Initech", "Umbrella Corp"] },
  { placeholder: "Job type", width: "150px", values: ["Full-time", "Part-time", "Contract", "Internship"] },
  { placeholder: "Job language", width: "150px", values: ["English", "Spanish", "French", "German"] },
  { placeholder: "Skills", width: "150px", values: ["React", "Node.js", "Python", "UI/UX", "AWS"] },
];

const Filters = () => (
  <HStack
    p={3}
    spacing={3}
    bg="white"
    borderBottom="1px solid"
    borderColor="gray.200"
    wrap="wrap"
    boxShadow="sm"
  >
    {filterOptions.map((filter, index) => (
      <Select
        key={index}
        placeholder={filter.placeholder}
        w={filter.width}
        variant="outline"
        borderRadius="md"
        borderColor="gray.300"
        _hover={{ borderColor: "blue.400", boxShadow: "sm" }}
        _focus={{ borderColor: "blue.500", boxShadow: "0 0 0 1px #3182ce" }}
      >
        {filter.values.map((value, i) => (
          <option key={i} value={value}>
            {value}
          </option>
        ))}
      </Select>
    ))}
  </HStack>
);

export default Filters;
