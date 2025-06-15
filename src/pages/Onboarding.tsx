import React, { useState } from 'react'
import {
  Box,
  Button,
  VStack,
  Heading,
  Text,
  useToast,
  Progress,
  SimpleGrid,
  Tag,
  TagLabel,
  TagCloseButton,
  Input,
  HStack,
} from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../store/useStore'

const interests = [
  'Science',
  'Technology',
  'Engineering',
  'Mathematics',
  'Arts',
  'Music',
  'Sports',
  'Reading',
  'Writing',
  'Coding',
  'Design',
  'Business',
]

const Onboarding = () => {
  const [step, setStep] = useState(1)
  const [selectedInterests, setSelectedInterests] = useState<string[]>([])
  const [customInterest, setCustomInterest] = useState('')
  const toast = useToast()
  const navigate = useNavigate()
  const addInterest = useStore((state) => state.addInterest)

  const handleInterestToggle = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter((i) => i !== interest))
    } else {
      setSelectedInterests([...selectedInterests, interest])
    }
  }

  const handleAddCustomInterest = () => {
    if (customInterest && !selectedInterests.includes(customInterest)) {
      setSelectedInterests([...selectedInterests, customInterest])
      setCustomInterest('')
    }
  }

  const handleNext = () => {
    if (step === 1 && selectedInterests.length === 0) {
      toast({
        title: 'Please select at least one interest',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      })
      return
    }

    if (step === 1) {
      selectedInterests.forEach((interest) => addInterest(interest))
      setStep(2)
    } else {
      navigate('/dashboard')
    }
  }

  return (
    <Box maxW="2xl" mx="auto" mt={8} p={6}>
      <VStack spacing={8}>
        <Progress value={(step / 2) * 100} width="100%" colorScheme="brand" />
        
        <Heading size="lg">
          {step === 1 ? 'What interests you?' : 'Almost there!'}
        </Heading>
        
        <Text color="gray.600" textAlign="center">
          {step === 1
            ? 'Select your interests to help us personalize your experience'
            : 'Your profile is being set up. Get ready to explore your path!'}
        </Text>

        {step === 1 && (
          <>
            <SimpleGrid columns={{ base: 2, md: 3 }} spacing={4} width="100%">
              {interests.map((interest) => (
                <Tag
                  key={interest}
                  size="lg"
                  borderRadius="full"
                  variant={selectedInterests.includes(interest) ? 'solid' : 'outline'}
                  colorScheme="brand"
                  cursor="pointer"
                  onClick={() => handleInterestToggle(interest)}
                >
                  <TagLabel>{interest}</TagLabel>
                  {selectedInterests.includes(interest) && <TagCloseButton />}
                </Tag>
              ))}
            </SimpleGrid>

            <HStack width="100%">
              <Input
                placeholder="Add your own interest"
                value={customInterest}
                onChange={(e) => setCustomInterest(e.target.value)}
              />
              <Button onClick={handleAddCustomInterest}>Add</Button>
            </HStack>
          </>
        )}

        <Button
          colorScheme="brand"
          size="lg"
          width="full"
          onClick={handleNext}
        >
          {step === 1 ? 'Next' : 'Get Started'}
        </Button>
      </VStack>
    </Box>
  )
}

export default Onboarding 