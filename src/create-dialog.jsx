import React, { useState } from 'react';

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Flex,
  Input,
  Textarea,
  Link,
  useClipboard
} from '@chakra-ui/react'

import { produce } from 'immer';

import { linkToPuzzle } from './utils';


export default function CreateDialog({isOpen, onClose}) {

  const [puzzles, setPuzzles] = useState(() => {
    const storedPuzzles = window.localStorage.getItem('puzzles');
    if (storedPuzzles) {
      return JSON.parse(storedPuzzles)
    } else {
      return [];
    }
  })

  function updatePuzzles(recipe) {
    const newPuzzles = produce(puzzles, recipe);
    window.localStorage.setItem('puzzles', JSON.stringify(newPuzzles));
    setPuzzles(newPuzzles);
  }

  function addEmpty() {
    updatePuzzles(draft => {
      draft.push(
        { title: '-new puzzle-', cols: 8, rows: 8, dictionary: []}
      )
    });
  }

  function updatePuzzleTitle(index, event) {
    updatePuzzles(draft => {
      draft[index].title = event.target.value;
    })
  };

  function updatePuzzleRows(index, event) {
    updatePuzzles(draft => {
      draft[index].rows = parseInt(event.target.value);
    })
  };

  function updatePuzzleCols(index, event) {
    updatePuzzles(draft => {
      draft[index].cols = parseInt(event.target.value);
    })
  };

  function updatePuzzleWords(index, event) {
    updatePuzzles(draft => {
      draft[index].dictionary = event.target.value.split(' ');
    })
  };

  const { onCopy } = useClipboard();

  function copyLink(index) {
    console.log(linkToPuzzle(puzzles[index]))
    onCopy(linkToPuzzle(puzzles[index]));
  }

  return <Modal isOpen={isOpen} onClose={onClose} size="xl" scrollBehavior="inside">
    <ModalOverlay />
    <ModalContent>
      <ModalHeader>Create Puzzles</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <Flex direction="column" gap={4}>
          { puzzles.length == 0 ? (
            'No puzzles created'
          ) : (
            puzzles.map((puzzle, index) => (
              <Flex key={index} direction="column" borderColor="blue.200" borderLeftWidth={2} borderStyle="solid" pl={2}>
                <Flex>
                  <Flex direction="column" basis="40%">
                    <Input value={puzzle.title} onChange={e => updatePuzzleTitle(index, e)} />
                    <Flex align="center" mt={2}>
                      <Input value={puzzle.cols} mr={2} onChange={e => updatePuzzleCols(index, e)}/> X
                      <Input value={puzzle.rows} ml={2} onChange={e => updatePuzzleRows(index, e)}/>
                    </Flex>
                  </Flex>
                  <Flex grow={1} ml={2}>
                    <Textarea placeholder="words" onChange={e => updatePuzzleWords(index, e)} value={puzzle.dictionary.join(' ')}/>
                    </Flex>
                  </Flex>

                <Flex mt={3} align="center" justify="flex-end">
                  <Link href={linkToPuzzle(puzzle)}>Open puzzle</Link>
                  <Button ml={4} onClick={() => copyLink(index)}>Copy Link</Button>
                </Flex>
              </Flex>
            ))
          ) }
        </Flex>
      </ModalBody>

      <ModalFooter>
        <Button colorScheme='green' onClick={addEmpty}>Create New</Button>
      </ModalFooter>
    </ModalContent>
  </Modal>
}
