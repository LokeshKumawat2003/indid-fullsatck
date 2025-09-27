import React from "react";
import { HStack, Select } from "@chakra-ui/react";

const filterOptions = [
  { 
    key: "pay", 
    placeholder: "Pay", 
    width: "150px", 
    values: ["$50k+", "$100k+", "$150k+"] 
  },
  { 
    key: "workMode", 
    placeholder: "Remote", 
    width: "150px", 
    values: ["Remote", "Hybrid", "On-site"] 
  },
  { 
    key: "distance", 
    placeholder: "Within 25 km", 
    width: "180px", 
    values: ["10 km", "25 km", "50 km", "100 km"] 
  },
  { 
    key: "company", 
    placeholder: "Company", 
    width: "150px", 
    values: ["Acme Corp", "Globex", "Initech", "Umbrella Corp"] 
  },
  { 
    key: "jobType", 
    placeholder: "Job type", 
    width: "150px", 
    values: ["Full-time", "Part-time", "Contract", "Internship"] 
  },
  { 
    key: "language", 
    placeholder: "Job language", 
    width: "150px", 
    values: ["English", "Spanish", "French", "German"] 
  },
  { 
    key: "skills", 
    placeholder: "Skills", 
    width: "150px", 
    values: ["React", "Node.js", "Python", "UI/UX", "AWS"] 
  },
];

const Filters = ({ onFilterChange }) => {
  const handleFilterChange = (key, value) => {
    // Call the onFilterChange prop with the selected filter
    onFilterChange(key, value);
  };

  return (
    <HStack
      p={3}
      spacing={3}
      bg="white"
      borderBottom="1px solid"
      borderColor="gray.200"
      wrap="wrap"
      boxShadow="sm"
    >
      {filterOptions.map((filter) => (
        <Select
          key={filter.key}
          placeholder={filter.placeholder}
          w={filter.width}
          variant="outline"
          borderRadius="md"
          borderColor="gray.300"
          _hover={{ borderColor: "blue.400", boxShadow: "sm" }}
          _focus={{ borderColor: "blue.500", boxShadow: "0 0 0 1px #3182ce" }}
          onChange={(e) => handleFilterChange(filter.key, e.target.value)}
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
};

export default Filters;
