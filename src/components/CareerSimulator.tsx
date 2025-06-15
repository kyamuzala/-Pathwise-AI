import React, { useState } from 'react'
import {
  Box,
  VStack,
  Heading,
  Text,
  Button,
  Progress,
  Card,
  CardBody,
  CardHeader,
  SimpleGrid,
  useToast,
  HStack,
  Tag,
  TagLabel,
} from '@chakra-ui/react'
import { FaCode, FaChartLine, FaUsers, FaLightbulb } from 'react-icons/fa'

interface Scenario {
  id: string
  title: string
  description: string
  choices: Choice[]
  skills: string[]
  icon: React.ElementType
}

interface Choice {
  id: string
  text: string
  outcome: string
  skills: string[]
}

const scenarios: Scenario[] = [
  {
    id: 'bug-fix',
    title: 'Critical Bug Fix',
    description: 'A critical bug has been reported in production. How do you handle it?',
    choices: [
      {
        id: 'quick-fix',
        text: 'Implement a quick fix to resolve the immediate issue',
        outcome: 'The bug is fixed quickly, but might need a more robust solution later.',
        skills: ['Problem Solving', 'Technical Skills'],
      },
      {
        id: 'investigate',
        text: 'Investigate the root cause and implement a comprehensive fix',
        outcome: 'The bug is fixed properly, preventing similar issues in the future.',
        skills: ['Analytical Thinking', 'Technical Skills', 'Quality Assurance'],
      },
      {
        id: 'team',
        text: 'Collaborate with the team to find the best solution',
        outcome: 'The team works together to implement a robust fix.',
        skills: ['Teamwork', 'Communication', 'Technical Skills'],
      },
    ],
    skills: ['Problem Solving', 'Technical Skills', 'Teamwork'],
    icon: FaCode,
  },
  {
    id: 'data-analysis',
    title: 'Data Analysis Challenge',
    description: 'You need to analyze a large dataset to find insights. What's your approach?',
    choices: [
      {
        id: 'quick-look',
        text: 'Look for obvious patterns and trends',
        outcome: 'You find some basic insights, but might miss deeper patterns.',
        skills: ['Data Analysis', 'Quick Thinking'],
      },
      {
        id: 'deep-dive',
        text: 'Perform a thorough analysis with multiple approaches',
        outcome: 'You discover valuable insights and patterns in the data.',
        skills: ['Data Analysis', 'Analytical Thinking', 'Attention to Detail'],
      },
      {
        id: 'visualize',
        text: 'Create visualizations to better understand the data',
        outcome: 'The visualizations help you and others understand the data better.',
        skills: ['Data Visualization', 'Communication', 'Data Analysis'],
      },
    ],
    skills: ['Data Analysis', 'Analytical Thinking', 'Communication'],
    icon: FaChartLine,
  },
]

const CareerSimulator = () => {
  const [currentScenario, setCurrentScenario] = useState<Scenario | null>(null)
  const [selectedChoice, setSelectedChoice] = useState<Choice | null>(null)
  const [score, setScore] = useState(0)
  const toast = useToast()

  const handleScenarioSelect = (scenario: Scenario) => {
    setCurrentScenario(scenario)
    setSelectedChoice(null)
  }

  const handleChoiceSelect = (choice: Choice) => {
    setSelectedChoice(choice)
    setScore(score + choice.skills.length)
    toast({
      title: 'Choice Made!',
      description: choice.outcome,
      status: 'success',
      duration: 3000,
      isClosable: true,
    })
  }

  return (
    <Box>
      <VStack spacing={6} align="stretch">
        <Box>
          <Heading size="lg">Career Simulator</Heading>
          <Text color="gray.600">
            Experience real-world scenarios and develop your skills
          </Text>
        </Box>

        {!currentScenario ? (
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
            {scenarios.map((scenario) => (
              <Card
                key={scenario.id}
                cursor="pointer"
                onClick={() => handleScenarioSelect(scenario)}
                _hover={{ transform: 'translateY(-2px)', shadow: 'md' }}
                transition="all 0.2s"
              >
                <CardHeader>
                  <HStack>
                    <Box
                      p={2}
                      bg="brand.50"
                      color="brand.500"
                      borderRadius="md"
                    >
                      <scenario.icon />
                    </Box>
                    <Heading size="md">{scenario.title}</Heading>
                  </HStack>
                </CardHeader>
                <CardBody>
                  <VStack align="start" spacing={4}>
                    <Text color="gray.600">{scenario.description}</Text>
                    <HStack spacing={2}>
                      {scenario.skills.map((skill) => (
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
        ) : (
          <Card>
            <CardHeader>
              <HStack>
                <Box
                  p={2}
                  bg="brand.50"
                  color="brand.500"
                  borderRadius="md"
                >
                  <currentScenario.icon />
                </Box>
                <Heading size="md">{currentScenario.title}</Heading>
              </HStack>
            </CardHeader>
            <CardBody>
              <VStack spacing={6} align="stretch">
                <Text color="gray.600">{currentScenario.description}</Text>

                {!selectedChoice ? (
                  <VStack spacing={4} align="stretch">
                    {currentScenario.choices.map((choice) => (
                      <Button
                        key={choice.id}
                        variant="outline"
                        colorScheme="brand"
                        onClick={() => handleChoiceSelect(choice)}
                        height="auto"
                        py={4}
                        whiteSpace="normal"
                        textAlign="left"
                      >
                        {choice.text}
                      </Button>
                    ))}
                  </VStack>
                ) : (
                  <VStack spacing={4} align="stretch">
                    <Text fontWeight="bold">Your Choice:</Text>
                    <Text>{selectedChoice.text}</Text>
                    <Text fontWeight="bold">Outcome:</Text>
                    <Text>{selectedChoice.outcome}</Text>
                    <Text fontWeight="bold">Skills Developed:</Text>
                    <HStack spacing={2}>
                      {selectedChoice.skills.map((skill) => (
                        <Tag key={skill} colorScheme="brand" size="sm">
                          <TagLabel>{skill}</TagLabel>
                        </Tag>
                      ))}
                    </HStack>
                    <Button
                      colorScheme="brand"
                      onClick={() => setCurrentScenario(null)}
                    >
                      Try Another Scenario
                    </Button>
                  </VStack>
                )}
              </VStack>
            </CardBody>
          </Card>
        )}

        <Box>
          <Text mb={2}>Your Score: {score}</Text>
          <Progress value={(score / 20) * 100} colorScheme="brand" />
        </Box>
      </VStack>
    </Box>
  )
}

export default CareerSimulator 