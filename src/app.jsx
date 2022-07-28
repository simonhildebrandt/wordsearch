import React, { useState } from 'react';

import { default as solver } from "@blex41/word-search/dist/wordsearch.min.js";

import { Flex, Button, useDisclosure, Heading, useClipboard } from '@chakra-ui/react';

import Wordsearch from './wordsearch';
import CreateDialog from './create-dialog';

import { linkToPuzzle } from './utils';


export default function App() {

  const [config, setConfig] = useState(() => {
    const puzzle = new URLSearchParams(window.location.search).get('puzzle');
    if (puzzle) return JSON.parse(window.atob(puzzle));
  });

  const [wordsearch, setWordsearch] = useState(() => {
    if (config) return new solver(config);
  })

  const { isOpen, onOpen, onClose} = useDisclosure(); //{defaultIsOpen: true}


  const { onCopy } = useClipboard(linkToPuzzle(config))

  return <Flex direction="column" ml="auto" mr="auto" maxWidth={600}>

    <CreateDialog isOpen={isOpen} onClose={onClose}/>

    <Flex p={2} align="center" justify="space-between">
      <Flex align="center">
        <Button size='sm' onClick={onCopy}>Copy link</Button>
      </Flex>
      <Heading>{config?.title || "Wordfinder"}</Heading>
      <Button size='sm' onClick={onOpen}>Create</Button>
    </Flex>
    { config ? (
      <Wordsearch wordsearch={wordsearch} cols={config.cols} rows={config.rows}/>
    ) : (
      'No puzzle selected - try creating one.'
    ) }
  </Flex>
};
