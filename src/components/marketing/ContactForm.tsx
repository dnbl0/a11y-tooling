"use client";

// Contact form built from Spectrum form components so it inherits accessible
// labelling, validation messaging, and keyboard behaviour for free. Submits to
// /api/contact and shows inline success / error states. This is a place where
// using real Spectrum components (rather than custom marketing layout) is the
// right call — forms are exactly what Spectrum is built for.

import { useState } from "react";
import {
  Form,
  TextField,
  TextArea,
  Picker,
  Item,
  Button,
  InlineAlert,
  Heading,
  Content,
  Flex,
} from "@adobe/react-spectrum";

type Status = "idle" | "submitting" | "success" | "error";

const TOPICS = [
  { id: "demo", label: "Request a demo" },
  { id: "pricing", label: "Pricing question" },
  { id: "support", label: "Support" },
  { id: "other", label: "Something else" },
];

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [topic, setTopic] = useState<string | number>("demo");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [submitted, setSubmitted] = useState(false);

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const nameValid = name.trim().length > 1;
  const messageValid = message.trim().length > 4;
  const formValid = emailValid && nameValid && messageValid;

  async function handleSubmit() {
    setSubmitted(true);
    if (!formValid) return;
    setStatus("submitting");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, company, topic, message }),
      });
      if (!res.ok) throw new Error("Request failed");
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <InlineAlert variant="positive" width="100%">
        <Heading>Thanks — message received</Heading>
        <Content>
          We&apos;ve got your note and will be in touch at {email} shortly. (In this portfolio
          build, the submission is validated and logged server-side rather than emailed.)
        </Content>
      </InlineAlert>
    );
  }

  return (
    <Form
      maxWidth="100%"
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
      validationBehavior="aria"
    >
      <Flex direction="column" gap="size-200">
        <TextField
          label="Name"
          value={name}
          onChange={setName}
          isRequired
          validationState={submitted && !nameValid ? "invalid" : undefined}
          errorMessage="Please enter your name."
          width="100%"
        />
        <TextField
          label="Work email"
          type="email"
          value={email}
          onChange={setEmail}
          isRequired
          validationState={submitted && !emailValid ? "invalid" : undefined}
          errorMessage="Please enter a valid email address."
          width="100%"
        />
        <TextField label="Company" value={company} onChange={setCompany} width="100%" />
        <Picker
          label="What's this about?"
          selectedKey={topic}
          onSelectionChange={setTopic}
          width="100%"
        >
          {TOPICS.map((t) => (
            <Item key={t.id}>{t.label}</Item>
          ))}
        </Picker>
        <TextArea
          label="Message"
          value={message}
          onChange={setMessage}
          isRequired
          height="size-2000"
          validationState={submitted && !messageValid ? "invalid" : undefined}
          errorMessage="Please add a short message."
          width="100%"
        />

        {status === "error" && (
          <InlineAlert variant="negative" width="100%">
            <Heading>Something went wrong</Heading>
            <Content>The message couldn&apos;t be sent. Please try again.</Content>
          </InlineAlert>
        )}

        <Button
          type="submit"
          variant="accent"
          isPending={status === "submitting"}
          alignSelf="start"
        >
          Send message
        </Button>
      </Flex>
    </Form>
  );
}
