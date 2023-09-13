import { Address } from "@graphprotocol/graph-ts";
import {
  AttestationRegistryUpdated,
  ModuleRegistryUpdated,
  PortalRegistryUpdated,
  SchemaRegistryUpdated,
} from "../generated/Router/Router";
import { Registry } from "../generated/schema";

export function handleAttestationRegistryUpdated(
  event: AttestationRegistryUpdated
): void {
  saveRegistry("attestation", event.params.registryAddress);
}

export function handleModuleRegistryUpdated(
  event: ModuleRegistryUpdated
): void {
  saveRegistry("module", event.params.registryAddress);
}

export function handlePortalRegistryUpdated(
  event: PortalRegistryUpdated
): void {
  saveRegistry("portal", event.params.registryAddress);
}

export function handleSchemaRegistryUpdated(
  event: SchemaRegistryUpdated
): void {
  saveRegistry("schema", event.params.registryAddress);
}

function saveRegistry(type: string, address: Address): void {
  let registry = Registry.load(type);
  if (!registry) registry = new Registry(type);
  registry.address = address.toHex();
  registry.save();
}
