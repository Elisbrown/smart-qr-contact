import { local_storage_store } from "$lib/stores/localstorage";
import flush from "just-flush";
import kebab from "just-kebab-case";
import { derived } from "svelte/store";

export const contact = local_storage_store<Partial<ContactInfo>>("contact", {
	title: "CEO",
	organization: "Initech",
	first_name: "John",
	middle_name: "H",
	last_name: "Smith",
	nickname: "Johnny",
	emails: [
		{ label: "work", address: "work@example.com" },
		{ label: "home", address: "home@example.com" },
		{ label: "cell", address: "cell@example.com" },
	],
	phone_numbers: [
		{ label: "work", number: "+1 (555) 555-5555" },
		{ label: "home", number: "+1 (666) 666-6666" },
		{ label: "cell", number: "+1 (777) 777-7777" },
	],
	addresses: [
		{
			label: "home",
			street: "123 Main St.",
			street_2: "Apt. 1",
			city: "New York",
			state_province: "NY",
			postal_code: "10001",
			country_region: "USA",
		},
	],
	urls: [
		{ label: "homepage", href: "https://mysite.com" },
		{ label: "work", href: "https://google.com" },
	],
	photo_url: "",
});

export const file_name = derived(contact, ($contact) => {
	const parts: string[] = [];
	if ($contact?.first_name) parts.push($contact.first_name);
	if ($contact?.last_name) parts.push($contact.last_name);
	return kebab(parts.join("-"));
});

export const vcard = derived(contact, ($contact) => make_vcard($contact));

function make_vcard(contact: Partial<ContactInfo>): string {
	const parts: string[] = ["BEGIN:VCARD", "VERSION:3.0"];

	if (contact.first_name || contact.last_name || contact.middle_name) {
		const names = [contact.first_name, contact.middle_name, contact.last_name];
		parts.push(
			`N:${contact.last_name};${contact.first_name};${contact.middle_name}`,
			`FN:${names.join(" ")}`
		);
	}

	if (contact.title) parts.push(`TITLE:${contact.title}`);

	if (contact.organization) parts.push(`ORG:${contact.organization}`);

	if (contact.nickname) parts.push(`NICKNAME:${contact.nickname}`);

	if (contact.photo_url && contact.photo_url.trim()) {
		// Try multiple Samsung-compatible formats
		parts.push(`PHOTO:${contact.photo_url}`);
		parts.push(`PHOTO;VALUE=uri:${contact.photo_url}`);
	}

	parts.push(
		...construct_fields(
			contact?.emails,
			(email) => `EMAIL;${email.label};PREF:${email.address}`
		)
	);

	parts.push(
		...construct_fields(
			contact?.phone_numbers,
			(phone) => `TEL;${phone.label};VOICE;PREF:${phone.number}`
		)
	);

	// https://datatracker.ietf.org/doc/id/draft-ietf-vcarddav-vcardrev-02.html#ADR
	parts.push(
		...construct_fields(contact?.addresses, (address) => {
			const addr = [
				address.po_box,
				address.street_2,
				address.street,
				address.city,
				address.state_province,
				address.postal_code,
				address.country_region,
			];
			return `ADR;${address.label};POSTAL;PARCEL;DOM;PREF:${addr.join(";")}`;
		})
	);

	parts.push(
		...construct_fields(
			contact?.urls,
			(url) => `URL;${url.label};PREF:${url.href}`
		)
	);

	parts.push(`REV:${new Date().toISOString()}`, "END:VCARD");

	return parts.join("\n");
}

function construct_fields<T>(
	collection: T[] | undefined,
	cb: (v: T) => string
): string[] {
	const fields: string[] = [];

	if (!collection?.length) return fields;

	if (collection.length) {
		for (const item of collection) {
			if (!has_values(item)) continue;
			fields.push(cb(item));
		}
	}

	return fields;
}

function has_values(obj: any): boolean {
	const values = Object.values(obj).map((v) => (v === "" ? undefined : v));
	const flushed = flush(values);
	return Boolean(flushed?.length);
}

// contact.subscribe((contact) => console.log("contact:", contact));
