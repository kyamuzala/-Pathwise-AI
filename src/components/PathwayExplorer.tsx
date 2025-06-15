import React, { useState } from 'react'
import {
  Box,
  VStack,
  Heading,
  Text,
  SimpleGrid,
  Card,
  CardBody,
  CardHeader,
  Button,
  useColorModeValue,
  HStack,
  Tag,
  TagLabel,
} from '@chakra-ui/react'
import { FaGraduationCap, FaBriefcase, FaBook } from 'react-icons/fa'

interface Pathway {
  id: string
  title: string
  description: string
  steps: PathwayStep[]
  requiredSkills: string[]
}

interface PathwayStep {
  id: string
  title: string
  description: string
  type: 'education' | 'skill' | 'experience'
  icon: React.ElementType
}

const pathways: Pathway[] = [
  {
    id: 'software-engineering',
    title: 'Software Engineering',
    description: 'Become a software engineer and build the future of technology',
    steps: [
      {
        id: 'cs-degree',
        title: 'Computer Science Degree',
        description: 'Get a bachelor\'s degree in computer science',
        type: 'education',
        icon: FaGraduationCap,
      },
      {
        id: 'programming-skills',
        title: 'Programming Skills',
        description: 'Master programming languages and development tools',
        type: 'skill',
        icon: FaBook,
      },
      {
        id: 'internship',
        title: 'Software Internship',
        description: 'Gain real-world experience through internships',
        type: 'experience',
        icon: FaBriefcase,
      },
    ],
    requiredSkills: ['Programming', 'Problem Solving', 'Teamwork'],
  },
  {
    id: 'data-science',
    title: 'Data Science',
    description: 'Analyze data and drive business decisions',
    steps: [
      {
        id: 'stats-degree',
        title: 'Statistics Degree',
        description: 'Get a degree in statistics or related field',
        type: 'education',
        icon: FaGraduationCap,
      },
      {
        id: 'data-skills',
        title: 'Data Analysis Skills',
        description: 'Learn data analysis and visualization',
        type: 'skill',
        icon: FaBook,
      },
      {
        id: 'data-internship',
        title: 'Data Science Internship',
        description: 'Apply your skills in a real-world setting',
        type: 'experience',
        icon: FaBriefcase,
      },
    ],
    requiredSkills: ['Statistics', 'Programming', 'Analytical Thinking'],
  },
]

const PathwayExplorer = () => {
  const [selectedPathway, setSelectedPathway] = useState<Pathway | null>(null)
  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')

  return (
    <Box>
      <VStack spacing={6} align="stretch">
        <Box>
          <Heading size="lg">Explore Career Pathways</Heading>
          <Text color="gray.600">
            Discover different career paths and what it takes to get there
          </Text>
        </Box>

        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
          {pathways.map((pathway) => (
            <Card
              key={pathway.id}
              bg={bgColor}
              borderWidth={1}
              borderColor={borderColor}
              cursor="pointer"
              onClick={() => setSelectedPathway(pathway)}
              _hover={{ transform: 'translateY(-2px)', shadow: 'md' }}
              transition="all 0.2s"
            >
              <CardHeader>
                <Heading size="md">{pathway.title}</Heading>
              </CardHeader>
              <CardBody>
                <VStack align="start" spacing={4}>
                  <Text color="gray.600">{pathway.description}</Text>
                  <HStack spacing={2}>
                    {pathway.requiredSkills.map((skill) => (
                      <Tag key={skill} colorScheme="brand" size="sm">
                        <TagLabel>{skill}</TagLabel>
                      </Tag>
                    ))}
                  </HStack>
                </VStack>
              </CardBody>
            </Card>
          ))}
        </SimpleGrid>

        {selectedPathway && (
          <Card mt={6}>
            <CardHeader>
              <Heading size="md">{selectedPathway.title} Pathway</Heading>
            </CardHeader>
            <CardBody>
              <VStack spacing={6} align="stretch">
                {selectedPathway.steps.map((step, index) => (
                  <HStack key={step.id} spacing={4}>
                    <Box
                      p={3}
                      bg="brand.50"
                      color="brand.500"
                      borderRadius="md"
                    >
                      <step.icon />
                    </Box>
                    <VStack align="start" flex={1}>
                      <Heading size="sm">{step.title}</Heading>
                      <Text color="gray.600">{step.description}</Text>
                    </VStack>
                    {index < selectedPathway.steps.length - 1 && (
                      <Box
                        position="absolute"
                        left="24px"
                        top="60px"
                        bottom="-20px"
                        width="2px"
                        bg="brand.200"
                      />
                    )}
                  </HStack>
                ))}
              </VStack>
            </CardBody>
          </Card>
        )}
      </VStack>
    </Box>
  )
}

export default PathwayExplorer 