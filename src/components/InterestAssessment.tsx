import React, { useState } from 'react'
import {
  Box,
  VStack,
  Heading,
  Text,
  Button,
  Progress,
  Radio,
  RadioGroup,
  Stack,
  useToast,
} from '@chakra-ui/react'
import { useStore } from '../store/useStore'

interface Question {
  id: number
  text: string
  options: string[]
  category: string
}

const questions: Question[] = [
  {
    id: 1,
    text: 'How do you feel about solving complex problems?',
    options: ['I enjoy it', 'It\'s okay', 'I prefer simpler tasks'],
    category: 'analytical',
  },
  {
    id: 2,
    text: 'Do you enjoy working with others?',
    options: ['Yes, I love teamwork', 'Sometimes', 'I prefer working alone'],
    category: 'social',
  },
  {
    id: 3,
    text: 'How do you feel about creating new things?',
    options: ['I love being creative', 'I\'m somewhat creative', 'I prefer following established patterns'],
    category: 'creative',
  },
  {
    id: 4,
    text: 'Do you enjoy learning about how things work?',
    options: ['Yes, I\'m very curious', 'Sometimes', 'Not really'],
    category: 'technical',
  },
]

const InterestAssessment = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [selectedOption, setSelectedOption] = useState('')
  const toast = useToast()
  const addInterest = useStore((state) => state.addInterest)

  const handleAnswer = () => {
    if (!selectedOption) {
      toast({
        title: 'Please select an option',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      })
      return
    }

    setAnswers({ ...answers, [questions[currentQuestion].id]: selectedOption })
    setSelectedOption('')

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      // Process results
      const results = processResults()
      results.forEach((interest) => addInterest(interest))
      
      toast({
        title: 'Assessment Complete!',
        description: 'Your interests have been updated.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
    }
  }

  const processResults = (): string[] => {
    const interests: string[] = []
    const categoryScores: Record<string, number> = {
      analytical: 0,
      social: 0,
      creative: 0,
      technical: 0,
    }

    // Calculate category scores
    Object.entries(answers).forEach(([questionId, answer]) => {
      const question = questions.find((q) => q.id === parseInt(questionId))
      if (question) {
        const score = answer === question.options[0] ? 2 : answer === question.options[1] ? 1 : 0
        categoryScores[question.category] += score
      }
    })

    // Add interests based on scores
    if (categoryScores.analytical >= 3) interests.push('Problem Solving')
    if (categoryScores.social >= 3) interests.push('Teamwork')
    if (categoryScores.creative >= 3) interests.push('Creativity')
    if (categoryScores.technical >= 3) interests.push('Technology')

    return interests
  }

  return (
    <Box p={6} borderWidth={1} borderRadius="lg">
      <VStack spacing={6} align="stretch">
        <Box>
          <Heading size="md" mb={2}>
            Interest Assessment
          </Heading>
          <Text color="gray.600">
            Question {currentQuestion + 1} of {questions.length}
          </Text>
          <Progress
            value={((currentQuestion + 1) / questions.length) * 100}
            colorScheme="brand"
            mt={2}
          />
        </Box>

        <Box>
          <Text fontSize="lg" mb={4}>
            {questions[currentQuestion].text}
          </Text>
          <RadioGroup value={selectedOption} onChange={setSelectedOption}>
            <Stack spacing={4}>
              {questions[currentQuestion].options.map((option, index) => (
                <Radio key={index} value={option}>
                  {option}
                </Radio>
              ))}
            </Stack>
          </RadioGroup>
        </Box>

        <Button
          colorScheme="brand"
          onClick={handleAnswer}
          isDisabled={!selectedOption}
        >
          {currentQuestion < questions.length - 1 ? 'Next' : 'Finish'}
        </Button>
      </VStack>
    </Box>
  )
}

export default InterestAssessment 