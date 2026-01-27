<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageData, ActionData } from './$types';
	import type { MpSdk } from '@matterport/sdk';
	import tagAmianteImg from '$lib/assets/img/tagamiante.png';
	import tagPlombImg from '$lib/assets/img/tagplomb.png';
	import tagTermiteImg from '$lib/assets/img/tagtermite.png';
	import tagPemdImg from '$lib/assets/img/pemd360.png';
	import { Mail, Plus, Pencil, X, Save, Trash2 } from 'lucide-svelte';
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	let iframe: HTMLIFrameElement;
	let mpSdk: MpSdk | undefined = $state();

	let showMail = $state(false);
	let showAmiante = $state(false);
	let showPlomb = $state(false);
	let showTermite = $state(false);
	let showPemd = $state(false);

	// modal states and selected presence filters (defaults: both checked)
	let showAmianteModal = $state(false);
	let showPlombModal = $state(false);
	let showTermiteModal = $state(false);
	// Modal pour PEMD
	let showPemdModal = $state(false);

	// PEMD Edit Mode
	let pemdEditMode = $state(false);
	let showPemdCreateModal = $state(false);
	let pendingTagPosition: {
		anchorPosition: { x: number; y: number; z: number };
		normal: { x: number; y: number; z: number };
	} | null = $state(null);
	let intersectionSubscription: { cancel: () => void } | null = null;
	let lastIntersection: {
		position: { x: number; y: number; z: number };
		normal: { x: number; y: number; z: number };
	} | null = $state(null);
	let isSavingTag = $state(false);

	// Form fields for new PEMD tag
	let newPemdObjetId = $state('');
	let newPemdNatureId = $state('');
	let newPemdDescription = $state('');
	let newPemdQuantite = $state('');
	let newPemdEtage = $state('');
	let newPemdEtat = $state('');
	let newPemdLongueur = $state('');
	let newPemdLargeur = $state('');
	let newPemdEpaisseur = $state('');
	let newPemdPotentielReemploi = $state('');

	// Filtered categories and objects for the creation form
	let createFormGroupId: string | number = $state('');
	let createFormCategoryId: string | number = $state('');
	let createFormCategoriesFiltered = $state(
		[] as { id: number | null; name: string | null; groupeId: number | null }[]
	);
	let createFormObjectsFiltered = $state(
		[] as { id: number | null; name: string | null; categorieId: number | null }[]
	);

	let amiantePresenceSelected: number[] = [0, 1, 2];
	let plombPresenceSelected: number[] = [0, 1, 2];
	let termitePresenceSelected: number[] = [0, 1, 2];

	// PEMD filter / autocomplete state
	let pemdGroups = $state([] as { id: number | null; name: string | null }[]); // used for project-specific facets as before
	let pemdCategories = $state(
		[] as { id: number | null; name: string | null; groupeId: number | null }[]
	);
	let pemdObjects = $state(
		[] as { id: number | null; name: string | null; categorieId: number | null }[]
	);
	// Master list of objects (complete set) coming from server
	let allPemdObjects = $state(
		[] as { id: number | null; name: string | null; categorieId: number | null }[]
	);
	// Master lists coming from server (categorie_v2 and groupe)
	let allPemdGroups = $state([] as { id: number | null; name: string | null }[]);
	let categoriesV2 = $state(
		[] as { id: number | null; name: string | null; groupeId: number | null }[]
	);
	let selectedPemdGroup = $state('');
	let selectedPemdCategory = $state('');
	let selectedPemdObject = $state('');
	// Filtered lists (depend on selection)
	let pemdCategoriesFiltered = $state(
		[] as { id: number | null; name: string | null; groupeId: number | null }[]
	);
	let pemdObjectsFiltered = $state(
		[] as { id: number | null; name: string | null; categorieId: number | null }[]
	);

	// helper booleans for modal checkboxes
	let amiantePresent = $state(true);
	let amianteAbsent = $state(true);
	let amianteEnCours = $state(true);
	let plombPresent = $state(true);
	let plombAbsent = $state(true);
	let plombEnCours = $state(true);
	let termitePresent = $state(true);
	let termiteAbsent = $state(true);
	let termiteEnCours = $state(true);

	let mailSids: string[] = [];
	let amianteSids: string[] = [];
	let plombSids: string[] = [];
	let termiteSids: string[] = [];
	let pemdSids = $state([] as string[]);

	async function toggleMail() {
		if (!mpSdk) return;
		if (showMail) {
			if (data.tags && data.tags.length > 0) {
				console.log(`Adding ${data.tags.length} tags to the model`);
				for (const tag of data.tags) {
					try {
						const anchorPosition = JSON.parse(tag.anchorPosition);
						const stemVector = JSON.parse(tag.stemVector);
						const tagDate = tag.date ? new Date(tag.date).toLocaleDateString() : '';
						const tagDescriptor = {
							label: `Mail - ${tagDate}`,
							description: tag.content,
							anchorPosition: { x: anchorPosition.x, y: anchorPosition.y, z: anchorPosition.z },
							stemVector: { x: stemVector.x, y: stemVector.y, z: stemVector.z }
						};
						const [sid] = await mpSdk.Tag.add(tagDescriptor);
						mailSids.push(sid);
					} catch (tagError) {
						console.error(`Failed to add tag ${tag.id}:`, tagError);
					}
				}
			}
		} else {
			for (const sid of mailSids) {
				try {
					await mpSdk.Tag.remove(sid);
				} catch (e) {
					console.error(e);
				}
			}
			mailSids = [];
		}
	}

	async function toggleAmiante() {
		if (!mpSdk) return;
		if (showAmiante) {
			// Remove any previously added amiante tags so we don't duplicate or keep stale tags
			for (const sid of amianteSids) {
				try {
					await mpSdk.Tag.remove(sid);
				} catch (e) {
					console.error('Failed to remove previous amiante sid', sid, e);
				}
			}
			amianteSids = [];
			if (data.amianteTags && data.amianteTags.length > 0) {
				const filtered = data.amianteTags.filter((t: any) =>
					amiantePresenceSelected.includes(Number(t.presenceAmiante))
				);
				console.log(`Adding ${filtered.length} amiante tags`);
				for (const tag of filtered) {
					try {
						const anchorPosition = JSON.parse(tag.anchorPosition);
						const stemVector = JSON.parse(tag.stemVector);
						const amianteStatus = tag.presenceAmiante ? 'Présence' : 'Absence';
						const tagDescriptor = {
							label: `Amiante - ${amianteStatus}`,
							description: `${tag.description}\nType: ${tag.type}\nÉtage: ${tag.etage}`,
							anchorPosition: { x: anchorPosition.x, y: anchorPosition.y, z: anchorPosition.z },
							stemVector: { x: stemVector.x, y: stemVector.y, z: stemVector.z },
							color: tag.presenceAmiante ? { r: 1, g: 0, b: 0 } : { r: 0, g: 1, b: 0 }
						};
						const [sid] = await mpSdk.Tag.add(tagDescriptor);
						amianteSids.push(sid);
					} catch (tagError) {
						console.error(`Failed to add amiante tag ${tag.id}:`, tagError);
					}
				}
			}
		} else {
			for (const sid of amianteSids) {
				try {
					await mpSdk.Tag.remove(sid);
				} catch (e) {
					console.error(e);
				}
			}
			amianteSids = [];
		}
	}

	async function togglePlomb() {
		if (!mpSdk) return;
		if (showPlomb) {
			// remove previous plomb tags to avoid duplicates / stale display
			for (const sid of plombSids) {
				try {
					await mpSdk.Tag.remove(sid);
				} catch (e) {
					console.error('Failed to remove previous plomb sid', sid, e);
				}
			}
			plombSids = [];
			if (data.plombTags && data.plombTags.length > 0) {
				const filtered = data.plombTags.filter((t: any) =>
					plombPresenceSelected.includes(Number(t.presencePlomb))
				);
				console.log(`Adding ${filtered.length} plomb tags`);
				for (const tag of filtered) {
					try {
						const anchorPosition = JSON.parse(tag.anchorPosition);
						const stemVector = JSON.parse(tag.stemVector);
						const plombStatus = tag.presencePlomb ? 'Présence' : 'Absence';
						let description = tag.description;
						if (tag.presencePlomb && tag.concentration) {
							description += `\nConcentration: ${tag.concentration}`;
						}
						description += `\nÉtage: ${tag.etage}`;
						const tagDescriptor = {
							label: `Plomb - ${plombStatus}`,
							description: description,
							anchorPosition: { x: anchorPosition.x, y: anchorPosition.y, z: anchorPosition.z },
							stemVector: { x: stemVector.x, y: stemVector.y, z: stemVector.z },
							color: tag.presencePlomb ? { r: 1, g: 0.5, b: 0 } : { r: 0, g: 0.7, b: 1 }
						};
						const [sid] = await mpSdk.Tag.add(tagDescriptor);
						plombSids.push(sid);
					} catch (tagError) {
						console.error(`Failed to add plomb tag ${tag.id}:`, tagError);
					}
				}
			}
		} else {
			for (const sid of plombSids) {
				try {
					await mpSdk.Tag.remove(sid);
				} catch (e) {
					console.error(e);
				}
			}
			plombSids = [];
		}
	}

	async function toggleTermite() {
		if (!mpSdk) return;
		if (showTermite) {
			// remove any previous termite tags
			for (const sid of termiteSids) {
				try {
					await mpSdk.Tag.remove(sid);
				} catch (e) {
					console.error('Failed to remove previous termite sid', sid, e);
				}
			}
			termiteSids = [];
			if (data.termiteTags && data.termiteTags.length > 0) {
				const filtered = data.termiteTags.filter((t: any) =>
					termitePresenceSelected.includes(Number(t.presenceTermite))
				);
				console.log(`Adding ${filtered.length} termite tags`);
				for (const tag of filtered) {
					try {
						const anchorPosition = JSON.parse(tag.anchorPosition);
						const stemVector = JSON.parse(tag.stemVector);
						const termiteStatus = tag.presenceTermite ? 'Présence' : 'Absence';
						const tagDescriptor = {
							label: `Termite - ${termiteStatus}`,
							description: `${tag.description}\nÉtage: ${tag.etage}`,
							anchorPosition: { x: anchorPosition.x, y: anchorPosition.y, z: anchorPosition.z },
							stemVector: { x: stemVector.x, y: stemVector.y, z: stemVector.z },
							color: tag.presenceTermite ? { r: 0.6, g: 0.3, b: 0 } : { r: 0.5, g: 1, b: 0.5 }
						};
						const [sid] = await mpSdk.Tag.add(tagDescriptor);
						termiteSids.push(sid);
					} catch (tagError) {
						console.error(`Failed to add termite tag ${tag.id}:`, tagError);
					}
				}
			}
		} else {
			for (const sid of termiteSids) {
				try {
					await mpSdk.Tag.remove(sid);
				} catch (e) {
					console.error(e);
				}
			}
			termiteSids = [];
		}
	}

	// Build cache of PEMD facet lists for client-side filtering
	function buildPemdFacets() {
		const groups: { id: number | null; name: string | null }[] = [];
		const categories: { id: number | null; name: string | null; groupeId: number | null }[] = [];
		const objects: { id: number | null; name: string | null; categorieId: number | null }[] = [];
		if (!data.pemdFacets) {
			pemdGroups = groups;
			pemdCategories = categories;
			pemdObjects = objects;
			// set master lists
			allPemdGroups = data.groups || [];
			categoriesV2 = data.categoriesV2 || [];
			allPemdObjects = data.allPemdObjects || objects;
			return;
		}
		for (const f of data.pemdFacets) {
			if (f.groupeName != null) {
				if (!groups.some((g) => g.name === f.groupeName)) {
					groups.push({ id: f.groupeId, name: f.groupeName });
				}
			}
			if (f.categorieName != null) {
				if (!categories.some((c) => c.name === f.categorieName)) {
					categories.push({ id: f.categorieId, name: f.categorieName, groupeId: f.groupeId });
				}
			}
			if (f.objetName != null) {
				if (!objects.some((o) => o.name === f.objetName)) {
					objects.push({ id: f.objetId, name: f.objetName, categorieId: f.categorieId });
				}
			}
		}
		pemdGroups = groups;
		pemdCategories = categories;
		pemdObjects = objects;
		// set master lists from server response if available, otherwise keep what we derived
		allPemdGroups = data.groups || groups;
		categoriesV2 = data.categoriesV2 || categories;
		allPemdObjects = data.allPemdObjects || objects;
	}

	function isPemdFilterSelected() {
		return (
			selectedPemdGroup.trim() !== '' ||
			selectedPemdCategory.trim() !== '' ||
			selectedPemdObject.trim() !== ''
		);
	}

	// Handlers for group/category changes (run on input) — avoids using rune reactive statements
	function handleGroupChange() {
		if (selectedPemdGroup && selectedPemdGroup.trim() !== '') {
			const group = allPemdGroups.find(
				(g) => g.name === selectedPemdGroup || String(g.id) === selectedPemdGroup
			);
			if (group) {
				pemdCategoriesFiltered = categoriesV2.filter((c) => c.groupeId === group.id);
			} else {
				pemdCategoriesFiltered = [];
			}
			// Clear downstream selections
			selectedPemdCategory = '';
			selectedPemdObject = '';
		} else {
			// Show all categories when no group is selected
			pemdCategoriesFiltered = categoriesV2;
			pemdObjectsFiltered = allPemdObjects;
			selectedPemdCategory = '';
			selectedPemdObject = '';
		}
	}

	function handleCategoryChange() {
		if (selectedPemdCategory && selectedPemdCategory.trim() !== '') {
			const cat = categoriesV2.find(
				(c) => c.name === selectedPemdCategory || String(c.id) === selectedPemdCategory
			);
			if (cat) {
				pemdObjectsFiltered = allPemdObjects.filter((o) => o.categorieId === cat.id);
			} else {
				pemdObjectsFiltered = [];
			}
			selectedPemdObject = '';
		} else {
			// Show all objects when no category is selected
			pemdObjectsFiltered = allPemdObjects;
			selectedPemdObject = '';
		}
	}

	function getAllowedObjetIds() {
		const allowed = new Set<number>();
		if (selectedPemdObject.trim() !== '') {
			for (const o of allPemdObjects) {
				if (o.name === selectedPemdObject && o.id != null) allowed.add(o.id);
			}
			return Array.from(allowed).filter((v): v is number => v != null);
		}

		if (selectedPemdCategory.trim() !== '') {
			const cat = categoriesV2.find(
				(c) => c.id === Number(selectedPemdCategory) || c.name === selectedPemdCategory
			);
			if (cat) {
				for (const o of allPemdObjects) {
					if (o.categorieId === cat.id && o.id != null) allowed.add(o.id);
				}
			}
			return Array.from(allowed).filter((v): v is number => v != null);
		}

		if (selectedPemdGroup.trim() !== '') {
			const group = allPemdGroups.find(
				(g) => g.name === selectedPemdGroup || String(g.id) === selectedPemdGroup
			);
			if (group) {
				const allowedCatIds = categoriesV2.filter((c) => c.groupeId === group.id).map((c) => c.id);
				for (const o of allPemdObjects) {
					if (o.categorieId != null && allowedCatIds.includes(o.categorieId) && o.id != null)
						allowed.add(o.id);
				}
			}
			return Array.from(allowed).filter((v): v is number => v != null);
		}

		// no filter: return all object IDs
		for (const o of allPemdObjects) {
			if (o.id != null) allowed.add(o.id);
		}
		return Array.from(allowed).filter((v): v is number => v != null);
	}

	async function addFilteredPemdTags() {
		if (!mpSdk) return;
		const allowedIds = getAllowedObjetIds();
		if (!data.pemdTags || data.pemdTags.length === 0) return;
		// remove existing PEMD tags before adding the new filtered set
		await removePemdTags();
		const filtered = data.pemdTags.filter(
			(t: any) => t.objetId != null && allowedIds.includes(Number(t.objetId))
		);
		console.log(`Adding ${filtered.length} pemd tags (filtered)`);
		for (const tag of filtered) {
			try {
				if (!tag.anchorPosition || !tag.stemVector) continue;
				const anchorPosition = JSON.parse(tag.anchorPosition);
				const stemVector = JSON.parse(tag.stemVector);
				let description = tag.description || '';
				if (tag.quantite) description += `\nQuantité: ${tag.quantite}`;
				if (tag.etage) description += `\nÉtage: ${tag.etage}`;
				if (tag.etat) description += `\nÉtat: ${tag.etat}`;

				const tagDescriptor = {
					label: 'PEMD',
					description: description,
					anchorPosition: { x: anchorPosition.x, y: anchorPosition.y, z: anchorPosition.z },
					stemVector: { x: stemVector.x, y: stemVector.y, z: stemVector.z },
					color: { r: 0.6, g: 0.2, b: 0.8 }
				};
				const [sid] = await mpSdk.Tag.add(tagDescriptor);
				pemdSids.push(sid);
			} catch (tagError) {
				console.error(`Failed to add pemd tag ${tag.id}:`, tagError);
			}
		}
		// keep the UI toggle state true (user wants to display PEMD tags)
		showPemd = true;
		showPemdModal = false;
	}

	async function removePemdTags() {
		if (!mpSdk) return;
		for (const sid of pemdSids) {
			try {
				await mpSdk.Tag.remove(sid);
			} catch (e) {
				console.error('Failed to remove pemd sid', sid, e);
			}
		}
		pemdSids = [];
		showPemd = false;
	}

	// PEMD Edit Mode Functions
	let overlayElement: HTMLDivElement | undefined = $state();

	function togglePemdEditMode() {
		pemdEditMode = !pemdEditMode;
		if (pemdEditMode) {
			startListeningForClicks();
		} else {
			stopListeningForClicks();
		}
	}

	function startListeningForClicks() {
		if (!mpSdk) return;

		// Subscribe to pointer intersection to track where the user is pointing
		intersectionSubscription = mpSdk.Pointer.intersection.subscribe((intersectionData: any) => {
			if (intersectionData && intersectionData.position && intersectionData.normal) {
				lastIntersection = {
					position: intersectionData.position,
					normal: intersectionData.normal
				};
			}
		});
	}

	function stopListeningForClicks() {
		if (intersectionSubscription) {
			intersectionSubscription.cancel();
			intersectionSubscription = null;
		}
		lastIntersection = null;
	}

	// Handle click on the overlay - this captures clicks on the model
	function handleOverlayClick(event: MouseEvent) {
		if (!pemdEditMode || !lastIntersection) return;

		// Prevent the click from doing anything else
		event.preventDefault();
		event.stopPropagation();

		// Use the last known intersection position
		openPemdCreateModal(lastIntersection.position, lastIntersection.normal);
	}

	// Handle mouse move on overlay - briefly disable pointer-events to let iframe update intersection
	let pointerEventsTimeout: ReturnType<typeof setTimeout> | null = null;

	function handleOverlayMouseMove(event: MouseEvent) {
		if (!overlayElement || !pemdEditMode) return;

		// Temporarily disable pointer-events on overlay to let iframe receive the event
		overlayElement.style.pointerEvents = 'none';

		// Re-enable after a short delay
		if (pointerEventsTimeout) {
			clearTimeout(pointerEventsTimeout);
		}
		pointerEventsTimeout = setTimeout(() => {
			if (overlayElement && pemdEditMode) {
				overlayElement.style.pointerEvents = 'auto';
			}
		}, 50);
	}

	function openPemdCreateModal(
		position: { x: number; y: number; z: number },
		normal: { x: number; y: number; z: number }
	) {
		// Calculate stemVector from normal (pointing outward from surface)
		const stemVector = {
			x: normal.x * 0.15,
			y: normal.y * 0.15,
			z: normal.z * 0.15
		};

		pendingTagPosition = {
			anchorPosition: position,
			normal: stemVector
		};

		// Reset form fields
		newPemdObjetId = '';
		newPemdNatureId = '';
		newPemdDescription = '';
		newPemdQuantite = '';
		newPemdEtage = '';
		newPemdEtat = '';
		newPemdLongueur = '';
		newPemdLargeur = '';
		newPemdEpaisseur = '';
		newPemdPotentielReemploi = '';
		createFormGroupId = '';
		createFormCategoryId = '';
		// Start with empty lists - user must select group first, then category, then object
		createFormCategoriesFiltered = [];
		createFormObjectsFiltered = [];

		showPemdCreateModal = true;
	}

	function closePemdCreateModal() {
		showPemdCreateModal = false;
		pendingTagPosition = null;
	}

	function handleCreateFormGroupChange() {
		// createFormGroupId can be a number (from select) or empty string
		const groupIdValue = createFormGroupId;
		if (groupIdValue !== '' && groupIdValue !== null && groupIdValue !== undefined) {
			// Find the group by id
			const groupId = typeof groupIdValue === 'string' ? Number(groupIdValue) : groupIdValue;
			const group = (data.groups || []).find((g: any) => g.id === groupId);
			if (group) {
				// Filter categories by selected group
				createFormCategoriesFiltered = (data.categoriesV2 || []).filter(
					(c: any) => c.groupeId === group.id
				);
			} else {
				createFormCategoriesFiltered = [];
			}
			// Reset category and object selections - user must select category first
			createFormCategoryId = '';
			newPemdObjetId = '';
			// Objects are empty until a category is selected
			createFormObjectsFiltered = [];
		} else {
			// No group selected - categories and objects are empty
			createFormCategoriesFiltered = [];
			createFormObjectsFiltered = [];
			createFormCategoryId = '';
			newPemdObjetId = '';
		}
	}

	function handleCreateFormCategoryChange() {
		// createFormCategoryId can be a number (from select) or empty string
		const catIdValue = createFormCategoryId;
		if (catIdValue !== '' && catIdValue !== null && catIdValue !== undefined) {
			// Find the category by id
			const catId = typeof catIdValue === 'string' ? Number(catIdValue) : catIdValue;
			const cat = (data.categoriesV2 || []).find((c: any) => c.id === catId);
			if (cat) {
				// Filter objects by selected category
				createFormObjectsFiltered = (data.allPemdObjects || []).filter(
					(o: any) => o.categorieId === cat.id
				);
			} else {
				createFormObjectsFiltered = [];
			}
			newPemdObjetId = '';
		} else {
			// No category selected - objects are empty
			createFormObjectsFiltered = [];
			newPemdObjetId = '';
		}
	}

	async function addNewPemdTagToModel(tagData: any) {
		if (!mpSdk) return;

		try {
			const anchorPosition = JSON.parse(tagData.anchorPosition);
			const stemVector = JSON.parse(tagData.stemVector);

			let description = tagData.description || '';
			if (tagData.quantite) description += `\nQuantité: ${tagData.quantite}`;
			if (tagData.etage) description += `\nÉtage: ${tagData.etage}`;
			if (tagData.etat) description += `\nÉtat: ${tagData.etat}`;

			const tagDescriptor = {
				label: 'PEMD',
				description: description,
				anchorPosition: { x: anchorPosition.x, y: anchorPosition.y, z: anchorPosition.z },
				stemVector: { x: stemVector.x, y: stemVector.y, z: stemVector.z },
				color: { r: 0.6, g: 0.2, b: 0.8 }
			};

			const [sid] = await mpSdk.Tag.add(tagDescriptor);
			pemdSids.push(sid);
			showPemd = true;
		} catch (e) {
			console.error('Failed to add new PEMD tag to model:', e);
		}
	}

	onMount(() => {
		let handleUnhandledRejection: (ev: PromiseRejectionEvent) => void;
		(async () => {
			try {
				const { setupSdk } = await import('@matterport/sdk');
				mpSdk = await setupSdk(data.matterportSdkKey, { iframe });

				// Suppress noisy analytics/network errors coming from the Matterport SDK (often caused by ad-blockers)
				handleUnhandledRejection = (ev: PromiseRejectionEvent) => {
					try {
						const r: any = ev.reason;
						const msg =
							typeof r === 'string'
								? r
								: r && (r.message || (r.error && r.error.message) || r.url || '');
						if (msg && String(msg).includes('events.matterport.com')) {
							ev.preventDefault();
							console.debug('Ignored blocked Matterport analytics request:', r);
						}
					} catch (ignored) {
						// ignore handler errors
					}
				};
				window.addEventListener('unhandledrejection', handleUnhandledRejection);

				console.log('Matterport SDK connected', mpSdk);
			} catch (e) {
				console.error('Matterport SDK connection failed:', e);
			}
		})();

		return () => {
			if (handleUnhandledRejection)
				window.removeEventListener('unhandledrejection', handleUnhandledRejection);
			// Cleanup edit mode listeners
			stopListeningForClicks();
			// Clear any pending timeout
			if (pointerEventsTimeout) {
				clearTimeout(pointerEventsTimeout);
			}
			try {
				if (mpSdk && mpSdk.disconnect) mpSdk.disconnect();
			} catch (err) {
				console.error('Matterport SDK disconnect failed:', err);
			}
		};
	});

	// Effect to handle form submission result
	$effect(() => {
		if (form?.success && form?.tag) {
			// Add the new tag to the model
			addNewPemdTagToModel(form.tag);
			closePemdCreateModal();
			// Refresh the data
			invalidateAll();
		}
	});
</script>

<div class="h-screen w-full p-6 font-[Poppins] flex flex-col">
	<!-- Modals -->
	{#if showAmianteModal}
		<div class="fixed inset-0 z-50 flex items-center justify-center">
			<div
				class="absolute inset-0 bg-black/40"
				role="button"
				tabindex="0"
				aria-label="Fermer le modal"
				onclick={() => {
					showAmianteModal = false;
				}}
				onkeydown={(e) => {
					if (e.key === 'Enter' || e.key === ' ') {
						showAmianteModal = false;
					}
				}}
			></div>
			<div class="relative z-10 w-80 rounded-lg bg-white p-4 shadow-lg">
				<h3 class="mb-3 text-lg font-semibold">Filtrer Amiante</h3>
				<div class="mb-3 flex flex-col gap-2">
					<label class="flex items-center gap-2">
						<input type="checkbox" bind:checked={amiantePresent} />
						<span>Présence</span>
					</label>
					<label class="flex items-center gap-2">
						<input type="checkbox" bind:checked={amianteAbsent} />
						<span>Absence</span>
					</label>
					<label class="flex items-center gap-2">
						<input type="checkbox" bind:checked={amianteEnCours} />
						<span>En cours</span>
					</label>
				</div>
				<div class="flex justify-end gap-2">
					<button
						class="rounded px-3 py-1 text-sm"
						onclick={() => {
							showAmianteModal = false;
						}}>Annuler</button
					>
					<button
						class="rounded bg-blue-600 px-3 py-1 text-sm text-white"
						onclick={() => {
							amiantePresenceSelected = [];
							if (amiantePresent) amiantePresenceSelected.push(1);
							if (amianteAbsent) amiantePresenceSelected.push(0);
							if (amianteEnCours) amiantePresenceSelected.push(2);
							showAmianteModal = false;
							showAmiante = true;
							toggleAmiante();
						}}>Appliquer</button
					>
				</div>
			</div>
		</div>
	{/if}

	{#if showPemdModal}
		<div class="fixed inset-0 z-50 flex items-center justify-center">
			<div
				class="absolute inset-0 bg-black/40"
				role="button"
				tabindex="0"
				aria-label="Fermer le modal"
				onclick={() => {
					showPemdModal = false;
				}}
				onkeydown={(e) => {
					if (e.key === 'Enter' || e.key === ' ') {
						showPemdModal = false;
					}
				}}
			></div>
			<div class="relative z-10 w-96 rounded-lg bg-white p-4 shadow-lg">
				<h3 class="mb-3 text-lg font-semibold">Filtrer PEMD</h3>
				<div class="mb-3 flex flex-col gap-2">
					<label class="flex flex-col">
						<span class="text-sm text-gray-700">Groupe</span>
						<select
							bind:value={selectedPemdGroup}
							onchange={handleGroupChange}
							class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
						>
							<option value="">Tous groupes</option>
							{#each allPemdGroups as g}
								<option value={g.name}>{g.name}</option>
							{/each}
						</select>
					</label>
					<label class="flex flex-col">
						<span class="text-sm text-gray-700">Catégorie</span>
						<select
							bind:value={selectedPemdCategory}
							onchange={handleCategoryChange}
							class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
						>
							<option value="">Toutes catégories</option>
							{#each pemdCategoriesFiltered as c}
								<option value={c.name}>{c.name}</option>
							{/each}
						</select>
					</label>
					<label class="flex flex-col">
						<span class="text-sm text-gray-700">Objet</span>
						<select
							bind:value={selectedPemdObject}
							class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
						>
							<option value="">Tous objets</option>
							{#each pemdObjectsFiltered as o}
								<option value={o.name}>{o.name}</option>
							{/each}
						</select>
					</label>
				</div>
				<div class="flex justify-end gap-3">
					<button
						class="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
						onclick={() => {
							showPemdModal = false;
						}}>Fermer</button
					>
					<button
						class="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
						onclick={removePemdTags}
						disabled={pemdSids.length === 0}>Supprimer les tags PEMD</button
					>
					<button
						class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
						onclick={addFilteredPemdTags}>Ajouter dans le modèle</button
					>
				</div>
			</div>
		</div>
	{/if}

	{#if showPlombModal}
		<div class="fixed inset-0 z-50 flex items-center justify-center">
			<div
				class="absolute inset-0 bg-black/40"
				role="button"
				tabindex="0"
				aria-label="Fermer le modal"
				onclick={() => {
					showPlombModal = false;
				}}
				onkeydown={(e) => {
					if (e.key === 'Enter' || e.key === ' ') {
						showPlombModal = false;
					}
				}}
			></div>
			<div class="relative z-10 w-80 rounded-lg bg-white p-4 shadow-lg">
				<h3 class="mb-3 text-lg font-semibold">Filtrer Plomb</h3>
				<div class="mb-3 flex flex-col gap-2">
					<label class="flex items-center gap-2">
						<input type="checkbox" bind:checked={plombPresent} />
						<span>Présence</span>
					</label>
					<label class="flex items-center gap-2">
						<input type="checkbox" bind:checked={plombAbsent} />
						<span>Absence</span>
					</label>
					<label class="flex items-center gap-2">
						<input type="checkbox" bind:checked={plombEnCours} />
						<span>En cours</span>
					</label>
				</div>
				<div class="flex justify-end gap-2">
					<button
						class="rounded px-3 py-1 text-sm"
						onclick={() => {
							showPlombModal = false;
						}}>Annuler</button
					>
					<button
						class="rounded bg-blue-600 px-3 py-1 text-sm text-white"
						onclick={() => {
							plombPresenceSelected = [];
							if (plombPresent) plombPresenceSelected.push(1);
							if (plombAbsent) plombPresenceSelected.push(0);
							if (plombEnCours) plombPresenceSelected.push(2);
							showPlombModal = false;
							showPlomb = true;
							togglePlomb();
						}}>Appliquer</button
					>
				</div>
			</div>
		</div>
	{/if}

	{#if showTermiteModal}
		<div class="fixed inset-0 z-50 flex items-center justify-center">
			<div
				class="absolute inset-0 bg-black/40"
				role="button"
				tabindex="0"
				aria-label="Fermer le modal"
				onclick={() => {
					showTermiteModal = false;
				}}
				onkeydown={(e) => {
					if (e.key === 'Enter' || e.key === ' ') {
						showTermiteModal = false;
					}
				}}
			></div>
			<div class="relative z-10 w-80 rounded-lg bg-white p-4 shadow-lg">
				<h3 class="mb-3 text-lg font-semibold">Filtrer Termite</h3>
				<div class="mb-3 flex flex-col gap-2">
					<label class="flex items-center gap-2">
						<input type="checkbox" bind:checked={termitePresent} />
						<span>Présence</span>
					</label>
					<label class="flex items-center gap-2">
						<input type="checkbox" bind:checked={termiteAbsent} />
						<span>Absence</span>
					</label>
					<label class="flex items-center gap-2">
						<input type="checkbox" bind:checked={termiteEnCours} />
						<span>En cours</span>
					</label>
				</div>
				<div class="flex justify-end gap-2">
					<button
						class="rounded px-3 py-1 text-sm"
						onclick={() => {
							showTermiteModal = false;
						}}>Annuler</button
					>
					<button
						class="rounded bg-blue-600 px-3 py-1 text-sm text-white"
						onclick={() => {
							termitePresenceSelected = [];
							if (termitePresent) termitePresenceSelected.push(1);
							if (termiteAbsent) termitePresenceSelected.push(0);
							if (termiteEnCours) termitePresenceSelected.push(2);
							showTermiteModal = false;
							showTermite = true;
							toggleTermite();
						}}>Appliquer</button
					>
				</div>
			</div>
		</div>
	{/if}

	<!-- PEMD Creation Modal -->
	{#if showPemdCreateModal && pendingTagPosition}
		<div class="fixed inset-0 z-50 flex items-center justify-center">
			<div
				class="absolute inset-0 bg-black/40"
				role="button"
				tabindex="0"
				aria-label="Fermer le modal"
				onclick={closePemdCreateModal}
				onkeydown={(e) => {
					if (e.key === 'Enter' || e.key === ' ') {
						closePemdCreateModal();
					}
				}}
			></div>
			<div
				class="relative z-10 w-[500px] max-h-[90vh] overflow-y-auto rounded-lg bg-white p-6 shadow-lg"
			>
				<div class="flex items-center justify-between mb-4">
					<h3 class="text-lg font-semibold flex items-center gap-2">
						<Plus size={20} />
						Nouveau tag PEMD
					</h3>
					<button
						type="button"
						onclick={closePemdCreateModal}
						class="text-gray-400 hover:text-gray-600"
					>
						<X size={24} />
					</button>
				</div>

				<form
					method="POST"
					action="?/createPemdTag"
					use:enhance={() => {
						isSavingTag = true;
						return async ({ result, update }) => {
							isSavingTag = false;
							if (result.type === 'success') {
								await update();
							} else {
								await update();
							}
						};
					}}
				>
					<!-- Hidden fields for position -->
					<input
						type="hidden"
						name="anchorPosition"
						value={JSON.stringify(pendingTagPosition.anchorPosition)}
					/>
					<input
						type="hidden"
						name="stemVector"
						value={JSON.stringify(pendingTagPosition.normal)}
					/>

					<!-- Legend for required fields -->
					<p class="text-xs text-gray-500 mb-4">
						Les champs marqués d'un <span class="text-red-500 font-medium">*</span> sont obligatoires
					</p>

					<div class="space-y-4">
						<!-- Section: Identification du matériau -->
						<div class="border-b border-gray-200 pb-4">
							<h4 class="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
								<span class="w-1.5 h-1.5 bg-purple-500 rounded-full"></span>
								Identification du matériau <span class="text-red-500">*</span>
							</h4>

							<!-- Étape 1: Groupe -->
							<div class="mb-3">
								<label for="pemd-groupe" class="block text-sm font-medium text-gray-700 mb-1">
									<span
										class="inline-flex items-center justify-center w-5 h-5 bg-purple-100 text-purple-700 rounded-full text-xs font-bold mr-1"
										>1</span
									>
									Groupe
								</label>
								<select
									id="pemd-groupe"
									bind:value={createFormGroupId}
									onchange={handleCreateFormGroupChange}
									class="w-full border border-purple-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
								>
									<option value="">-- Sélectionner un groupe --</option>
									{#each data.groups || [] as g}
										<option value={g.id}>{g.name}</option>
									{/each}
								</select>
								{#if !createFormGroupId}
									<p class="text-xs text-purple-600 mt-1">Commencez par sélectionner un groupe</p>
								{/if}
							</div>

							<!-- Étape 2: Catégorie -->
							<div class="mb-3">
								<label for="pemd-categorie" class="block text-sm font-medium text-gray-700 mb-1">
									<span
										class="inline-flex items-center justify-center w-5 h-5 {createFormGroupId
											? 'bg-purple-100 text-purple-700'
											: 'bg-gray-200 text-gray-400'} rounded-full text-xs font-bold mr-1">2</span
									>
									Catégorie
								</label>
								<select
									id="pemd-categorie"
									bind:value={createFormCategoryId}
									onchange={handleCreateFormCategoryChange}
									disabled={!createFormGroupId || createFormCategoriesFiltered.length === 0}
									class="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white disabled:bg-gray-100 disabled:cursor-not-allowed {createFormGroupId &&
									!createFormCategoryId
										? 'border-purple-300'
										: 'border-gray-300'}"
								>
									<option value="">-- Sélectionner une catégorie --</option>
									{#each createFormCategoriesFiltered as c}
										<option value={c.id}>{c.name}</option>
									{/each}
								</select>
								{#if !createFormGroupId}
									<p class="text-xs text-gray-400 mt-1">Sélectionnez d'abord un groupe</p>
								{:else if createFormCategoriesFiltered.length === 0}
									<p class="text-xs text-amber-600 mt-1">
										Aucune catégorie disponible pour ce groupe
									</p>
								{:else if !createFormCategoryId}
									<p class="text-xs text-purple-600 mt-1">
										Sélectionnez une catégorie ({createFormCategoriesFiltered.length} disponible{createFormCategoriesFiltered.length >
										1
											? 's'
											: ''})
									</p>
								{/if}
							</div>

							<!-- Étape 3: Objet (OBLIGATOIRE) -->
							<div>
								<label for="pemd-objet" class="block text-sm font-medium text-gray-700 mb-1">
									<span
										class="inline-flex items-center justify-center w-5 h-5 {createFormCategoryId
											? 'bg-purple-100 text-purple-700'
											: 'bg-gray-200 text-gray-400'} rounded-full text-xs font-bold mr-1">3</span
									>
									Objet <span class="text-red-500">*</span>
								</label>
								<select
									id="pemd-objet"
									bind:value={newPemdObjetId}
									name="objetId"
									required
									disabled={!createFormCategoryId || createFormObjectsFiltered.length === 0}
									class="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white disabled:bg-gray-100 disabled:cursor-not-allowed {createFormCategoryId &&
									!newPemdObjetId
										? 'border-red-300'
										: 'border-gray-300'}"
								>
									<option value="">-- Sélectionner un objet --</option>
									{#each createFormObjectsFiltered as o}
										<option value={o.id}>{o.name}</option>
									{/each}
								</select>
								{#if !createFormCategoryId}
									<p class="text-xs text-gray-400 mt-1">Sélectionnez d'abord une catégorie</p>
								{:else if createFormObjectsFiltered.length === 0}
									<p class="text-xs text-amber-600 mt-1">
										Aucun objet disponible pour cette catégorie
									</p>
								{:else if !newPemdObjetId}
									<p class="text-xs text-red-500 mt-1">
										Sélectionnez un objet ({createFormObjectsFiltered.length} disponible{createFormObjectsFiltered.length >
										1
											? 's'
											: ''})
									</p>
								{:else}
									<p class="text-xs text-green-600 mt-1">Objet sélectionné</p>
								{/if}
							</div>
						</div>

						<!-- Section: Informations complémentaires (optionnel) -->
						<div class="border-b border-gray-200 pb-4">
							<h4 class="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
								<span class="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
								Informations complémentaires
								<span class="text-gray-400 text-xs font-normal">(optionnel)</span>
							</h4>

							<!-- Description -->
							<div class="mb-3">
								<label for="pemd-description" class="block text-sm font-medium text-gray-600 mb-1"
									>Description</label
								>
								<textarea
									id="pemd-description"
									bind:value={newPemdDescription}
									name="description"
									rows="2"
									class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
									placeholder="Description du matériau..."
								></textarea>
							</div>

							<!-- Row: Quantité, Étage, État -->
							<div class="grid grid-cols-3 gap-3">
								<div>
									<label for="pemd-quantite" class="block text-sm font-medium text-gray-600 mb-1"
										>Quantité</label
									>
									<input
										id="pemd-quantite"
										type="number"
										step="0.01"
										min="0"
										bind:value={newPemdQuantite}
										name="quantite"
										class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
										placeholder="0"
									/>
								</div>
								<div>
									<label for="pemd-etage" class="block text-sm font-medium text-gray-600 mb-1"
										>Étage</label
									>
									<input
										id="pemd-etage"
										type="text"
										bind:value={newPemdEtage}
										name="etage"
										class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
										placeholder="RDC, 1, 2..."
									/>
								</div>
								<div>
									<label for="pemd-etat" class="block text-sm font-medium text-gray-600 mb-1"
										>État</label
									>
									<select
										id="pemd-etat"
										bind:value={newPemdEtat}
										name="etat"
										class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
									>
										<option value="">--</option>
										<option value="Bon">Bon</option>
										<option value="Moyen">Moyen</option>
										<option value="Mauvais">Mauvais</option>
									</select>
								</div>
							</div>
						</div>

						<!-- Section: Dimensions (optionnel) -->
						<div class="border-b border-gray-200 pb-4">
							<h4 class="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
								<span class="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
								Dimensions <span class="text-gray-400 text-xs font-normal">(optionnel)</span>
							</h4>

							<div class="grid grid-cols-3 gap-3">
								<div>
									<label for="pemd-longueur" class="block text-sm font-medium text-gray-600 mb-1"
										>Longueur (m)</label
									>
									<input
										id="pemd-longueur"
										type="number"
										step="0.01"
										min="0"
										bind:value={newPemdLongueur}
										name="longueur"
										class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
										placeholder="0.00"
									/>
								</div>
								<div>
									<label for="pemd-largeur" class="block text-sm font-medium text-gray-600 mb-1"
										>Largeur (m)</label
									>
									<input
										id="pemd-largeur"
										type="number"
										step="0.01"
										min="0"
										bind:value={newPemdLargeur}
										name="largeur"
										class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
										placeholder="0.00"
									/>
								</div>
								<div>
									<label for="pemd-epaisseur" class="block text-sm font-medium text-gray-600 mb-1"
										>Épaisseur (m)</label
									>
									<input
										id="pemd-epaisseur"
										type="number"
										step="0.01"
										min="0"
										bind:value={newPemdEpaisseur}
										name="epaisseur"
										class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
										placeholder="0.00"
									/>
								</div>
							</div>
						</div>

						<!-- Section: Potentiel Réemploi (optionnel) -->
						<div>
							<label for="pemd-potentiel" class="block text-sm font-medium text-gray-600 mb-1">
								Potentiel de réemploi <span class="text-gray-400 text-xs font-normal"
									>(optionnel)</span
								>
							</label>
							<select
								id="pemd-potentiel"
								bind:value={newPemdPotentielReemploi}
								name="potentielReemploi"
								class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
							>
								<option value="">-- Non défini --</option>
								<option value="Fort">Fort</option>
								<option value="Moyen">Moyen</option>
								<option value="Faible">Faible</option>
								<option value="Nul">Nul</option>
							</select>
						</div>

						<!-- Position info (readonly) -->
						<div
							class="bg-purple-50 rounded-lg p-3 text-sm text-purple-700 border border-purple-200"
						>
							<p class="font-medium mb-1 flex items-center gap-2">
								<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
									/>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
									/>
								</svg>
								Position sur le modèle 3D
							</p>
							<p class="text-xs font-mono">
								X: {pendingTagPosition.anchorPosition.x.toFixed(3)} | Y: {pendingTagPosition.anchorPosition.y.toFixed(
									3
								)} | Z: {pendingTagPosition.anchorPosition.z.toFixed(3)}
							</p>
						</div>
					</div>

					<div class="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
						<button
							type="button"
							onclick={closePemdCreateModal}
							class="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
						>
							Annuler
						</button>
						<button
							type="submit"
							disabled={isSavingTag || !newPemdObjetId}
							class="rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
						>
							<Save size={16} />
							{isSavingTag ? 'Enregistrement...' : 'Enregistrer le tag'}
						</button>
					</div>
				</form>
			</div>
		</div>
	{/if}

	<div class="mb-6 grid grid-cols-6 gap-4 w-full">
		<button
			type="button"
			title="Afficher les mail tags"
			aria-pressed={showMail}
			onclick={() => {
				showMail = !showMail;
				toggleMail();
			}}
			class={`w-full h-20 flex items-center justify-center rounded-lg border transition-transform transform focus:outline-none focus:ring-2 focus:ring-offset-2 ${showMail ? 'bg-blue-50 text-blue-700 ring-1 ring-blue-100 shadow-sm scale-105' : 'bg-gray-50 text-gray-700 hover:scale-105 hover:shadow-sm'}`}
		>
			<Mail
				size={32}
				class={`transition-transform ${showMail ? 'scale-110 text-blue-700' : 'text-gray-700'}`}
			/>
		</button>

		<button
			type="button"
			title="Afficher les tags amiante"
			aria-pressed={showAmiante}
			onclick={() => {
				if (showAmiante) {
					showAmiante = false;
					toggleAmiante();
				} else {
					showAmianteModal = true;
				}
			}}
			class={`w-full h-20 flex items-center justify-center rounded-lg border transition-transform transform focus:outline-none focus:ring-2 focus:ring-offset-2 ${showAmiante ? 'bg-blue-50 text-blue-700 ring-1 ring-blue-100 shadow-sm scale-105' : 'bg-gray-50 text-gray-700 hover:scale-105 hover:shadow-sm'}`}
		>
			<img
				src={tagAmianteImg}
				alt="amiante"
				class={`h-10 w-10 transition-transform ${showAmiante ? 'scale-110' : ''}`}
			/>
		</button>

		<button
			type="button"
			title="Afficher les tags plomb"
			aria-pressed={showPlomb}
			onclick={() => {
				if (showPlomb) {
					showPlomb = false;
					togglePlomb();
				} else {
					showPlombModal = true;
				}
			}}
			class={`w-full h-20 flex items-center justify-center rounded-lg border transition-transform transform focus:outline-none focus:ring-2 focus:ring-offset-2 ${showPlomb ? 'bg-blue-50 text-blue-700 ring-1 ring-blue-100 shadow-sm scale-105' : 'bg-gray-50 text-gray-700 hover:scale-105 hover:shadow-sm'}`}
		>
			<img
				src={tagPlombImg}
				alt="plomb"
				class={`h-10 w-10 transition-transform ${showPlomb ? 'scale-110' : ''}`}
			/>
		</button>

		<button
			type="button"
			title="Afficher les tags termite"
			aria-pressed={showTermite}
			onclick={() => {
				if (showTermite) {
					showTermite = false;
					toggleTermite();
				} else {
					showTermiteModal = true;
				}
			}}
			class={`w-full h-20 flex items-center justify-center rounded-lg border transition-transform transform focus:outline-none focus:ring-2 focus:ring-offset-2 ${showTermite ? 'bg-blue-50 text-blue-700 ring-1 ring-blue-100 shadow-sm scale-105' : 'bg-gray-50 text-gray-700 hover:scale-105 hover:shadow-sm'}`}
		>
			<img
				src={tagTermiteImg}
				alt="termite"
				class={`h-10 w-10 transition-transform ${showTermite ? 'scale-110' : ''}`}
			/>
		</button>

		<div class="flex flex-col gap-2">
			<button
				type="button"
				title="Afficher les tags PEMD"
				aria-pressed={showPemd}
				onclick={() => {
					// Open modal to choose filters (group / category / object) instead of adding all tags
					buildPemdFacets();
					showPemdModal = true;
				}}
				class={`w-full h-14 flex items-center justify-center rounded-lg border transition-transform transform focus:outline-none focus:ring-2 focus:ring-offset-2 ${showPemd ? 'bg-blue-50 text-blue-700 ring-1 ring-blue-100 shadow-sm scale-105' : 'bg-gray-50 text-gray-700 hover:scale-105 hover:shadow-sm'}`}
			>
				<img
					src={tagPemdImg}
					alt="pemd"
					class={`h-8 w-8 object-contain transition-transform ${showPemd ? 'scale-110' : ''}`}
				/>
			</button>
			{#if data.user?.role === 'admin' || data.user?.role === 'collaborateur'}
			<button
				type="button"
				title={pemdEditMode ? 'Désactiver le mode édition PEMD' : 'Activer le mode édition PEMD'}
				aria-pressed={pemdEditMode}
				onclick={togglePemdEditMode}
				class={`w-full h-6 flex items-center justify-center rounded-lg border text-xs font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 ${pemdEditMode ? 'bg-purple-600 text-white ring-1 ring-purple-300 shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-purple-50 hover:text-purple-600'}`}
			>
				<Pencil size={12} class="mr-1" />
				{pemdEditMode ? 'Édition ON' : 'Éditer'}
			</button>
			{/if}
		</div>
	</div>

	<!-- Edit mode indicator -->
	{#if pemdEditMode}
		<div
			class="mb-4 flex items-center justify-between bg-purple-50 border border-purple-200 rounded-lg px-4 py-3"
		>
			<div class="flex items-center gap-3">
				<div class="w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
				<span class="text-purple-700 font-medium">Mode édition PEMD actif</span>
				<span class="text-purple-600 text-sm"
					>- Cliquez directement sur le modèle pour ajouter un tag</span
				>
			</div>
			<button
				type="button"
				onclick={togglePemdEditMode}
				class="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
			>
				<X size={16} />
				Quitter le mode édition
			</button>
		</div>
	{/if}

	<div class="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm flex-1 relative">
		<iframe
			bind:this={iframe}
			title="Matterport Showcase"
			class="h-full w-full"
			src="https://my.matterport.com/show?m={data.projet
				.id}&play=1&applicationKey={data.matterportSdkKey}"
			frameborder="0"
			allow="fullscreen; vr"
		>
		</iframe>

		<!-- Overlay for capturing clicks in edit mode -->
		{#if pemdEditMode}
			<div
				bind:this={overlayElement}
				role="button"
				tabindex="0"
				aria-label="Cliquez pour ajouter un tag PEMD"
				class="absolute inset-0 cursor-crosshair z-10"
				style="background: rgba(147, 51, 234, 0.05);"
				onclick={handleOverlayClick}
				onmousemove={handleOverlayMouseMove}
				onkeydown={(e) => {
					if (e.key === 'Enter' || e.key === ' ') {
						if (lastIntersection) {
							openPemdCreateModal(lastIntersection.position, lastIntersection.normal);
						}
					}
				}}
			>
				<!-- Visual indicator showing where the tag will be placed -->
				{#if lastIntersection}
					<div
						class="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg px-4 py-2 shadow-lg border border-purple-200"
					>
						<div class="flex items-center gap-2 text-purple-700">
							<Plus size={16} />
							<span class="text-sm font-medium">Cliquez pour placer le tag</span>
						</div>
						<div class="text-xs text-gray-500 mt-1">
							Position: X={lastIntersection.position.x.toFixed(2)}, Y={lastIntersection.position.y.toFixed(
								2
							)}, Z={lastIntersection.position.z.toFixed(2)}
						</div>
					</div>
				{:else}
					<div
						class="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg px-4 py-2 shadow-lg border border-gray-200"
					>
						<div class="flex items-center gap-2 text-gray-500">
							<span class="text-sm">Déplacez le curseur sur le modèle...</span>
						</div>
					</div>
				{/if}
			</div>
		{/if}
	</div>
</div>
