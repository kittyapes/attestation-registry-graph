import { BigDecimal, log } from "@graphprotocol/graph-ts";
import {
  AttestationRegistered,
  AttestRegistry,
} from "../generated/templates/AttestRegistry/AttestRegistry";
import { ModuleRegistered } from "../generated/templates/ModuleRegistry/ModuleRegistry";
import { PortalRegistered } from "../generated/templates/PortalRegistry/PortalRegistry";
import {
  SchemaCreated,
  SchemaRegistry,
} from "../generated/templates/SchemaRegistry/SchemaRegistry";
import {
  Registry,
  Module,
  Portal,
  Schema,
  Attestation,
} from "../generated/schema";

export function handleAttestationRegistered(
  event: AttestationRegistered
): void {
  const registry = Registry.load("attestation");
  if (registry === null || registry.address !== event.address.toHex()) {
    log.warning("Not registered attestation registry: {}", [
      event.address.toHexString(),
    ]);
    return;
  }

  const contract = AttestRegistry.bind(event.address);
  const details = contract.getAttestation(event.params.attestationId);

  const attestation = new Attestation(event.params.attestationId.toString());
  attestation.schema = details.schemaId.toHexString();
  attestation.replaceBy = details.replacedBy.toHexString();
  attestation.attester = details.attester.toHexString();
  attestation.portal = details.portal.toHexString();
  attestation.createdAt = details.attestedDate;
  attestation.expireAt = details.expirationDate;
  attestation.revokeAt = details.revocationDate;
  attestation.version = details.version;
  attestation.revoked = details.revoked;
  attestation.subject = details.subject.toString();
  attestation.data = details.attestationData.toString();
  attestation.save();
}

export function handleModuleRegistered(event: ModuleRegistered): void {
  const registry = Registry.load("module");
  if (registry === null || registry.address !== event.address.toHex()) {
    log.warning("Not registered module registry: {}", [
      event.address.toHexString(),
    ]);
    return;
  }

  const module = new Module(event.params.moduleAddress.toHex());
  module.address = event.params.moduleAddress.toHex();
  module.name = event.params.name.toString();
  module.description = event.params.description.toString();
  module.save();
}

export function handlePortalRegistered(event: PortalRegistered): void {
  const registry = Registry.load("portal");
  if (registry === null || registry.address !== event.address.toHex()) {
    log.warning("Not registered portal registry: {}", [
      event.address.toHexString(),
    ]);
    return;
  }

  const portal = new Portal(event.params.portalAddress.toHex());
  portal.address = event.params.portalAddress.toHex();
  portal.name = event.params.name.toString();
  portal.description = event.params.description.toString();
  portal.save();
}

export function handleSchemaCreated(event: SchemaCreated): void {
  const registry = Registry.load("schema");
  if (registry === null || registry.address !== event.address.toHex()) {
    log.warning("Not registered schema registry: {}", [
      event.address.toHexString(),
    ]);
    return;
  }

  const contract = SchemaRegistry.bind(event.address);
  const schemaId = contract.getIdFromSchemaString(
    event.params.schemaString.toString()
  );

  const schema = new Schema(event.params.id.toString());
  schema.schemaId = schemaId.toString();
  schema.name = event.params.name.toString();
  schema.description = event.params.description.toString();
  schema.context = event.params.context.toString();
  schema.schema = event.params.schemaString.toString();
  schema.save();
}
