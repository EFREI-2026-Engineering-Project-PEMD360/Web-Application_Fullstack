<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';

	export let form: ActionData;

	let isSubmitting = false;
</script>

<div class="container">
	<h1>Créer un nouvel utilisateur</h1>

	{#if form?.success}
		<div class="alert alert-success">
			{form.message}
		</div>
	{/if}

	{#if form?.error}
		<div class="alert alert-error">
			{form.error}
		</div>
	{/if}

	<form
		method="POST"
		action="?/createUser"
		use:enhance={() => {
			isSubmitting = true;
			return async ({ update }) => {
				await update();
				isSubmitting = false;
			};
		}}
	>
		<div class="form-group">
			<label for="name">Nom complet *</label>
			<input
				type="text"
				id="name"
				name="name"
				required
				value={form?.name || ''}
				disabled={isSubmitting}
				placeholder="Jean Dupont"
			/>
		</div>

		<div class="form-group">
			<label for="email">Email *</label>
			<input
				type="email"
				id="email"
				name="email"
				required
				value={form?.email || ''}
				disabled={isSubmitting}
				placeholder="jean.dupont@example.com"
			/>
		</div>

		<div class="form-group">
			<label for="password">Mot de passe *</label>
			<input
				type="password"
				id="password"
				name="password"
				required
				minlength="8"
				disabled={isSubmitting}
				placeholder="Minimum 8 caractères"
			/>
		</div>

		<div class="form-group">
			<label for="role">Rôle</label>
			<select id="role" name="role" disabled={isSubmitting} value={form?.role || 'user'}>
				<option value="user">Utilisateur</option>
				<option value="admin">Administrateur</option>
			</select>
		</div>

		<button type="submit" disabled={isSubmitting} class="btn-primary">
			{isSubmitting ? 'Création en cours...' : 'Créer l\'utilisateur'}
		</button>
	</form>
</div>

<style>
	.container {
		max-width: 600px;
		margin: 2rem auto;
		padding: 2rem;
	}

	h1 {
		margin-bottom: 2rem;
		color: #333;
	}

	.alert {
		padding: 1rem;
		margin-bottom: 1.5rem;
		border-radius: 4px;
		font-weight: 500;
	}

	.alert-success {
		background-color: #d4edda;
		color: #155724;
		border: 1px solid #c3e6cb;
	}

	.alert-error {
		background-color: #f8d7da;
		color: #721c24;
		border: 1px solid #f5c6cb;
	}

	form {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.form-group {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	label {
		font-weight: 600;
		color: #555;
		font-size: 0.95rem;
	}

	input,
	select {
		padding: 0.75rem;
		border: 1px solid #ddd;
		border-radius: 4px;
		font-size: 1rem;
		transition: border-color 0.2s;
	}

	input:focus,
	select:focus {
		outline: none;
		border-color: #4a90e2;
		box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.1);
	}

	input:disabled,
	select:disabled {
		background-color: #f5f5f5;
		cursor: not-allowed;
	}

	.btn-primary {
		padding: 0.875rem 1.5rem;
		background-color: #4a90e2;
		color: white;
		border: none;
		border-radius: 4px;
		font-size: 1rem;
		font-weight: 600;
		cursor: pointer;
		transition: background-color 0.2s;
	}

	.btn-primary:hover:not(:disabled) {
		background-color: #357abd;
	}

	.btn-primary:disabled {
		background-color: #a0c4e8;
		cursor: not-allowed;
	}
</style>
