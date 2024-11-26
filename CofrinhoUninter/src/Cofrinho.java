package atividade.uninter;

import java.util.ArrayList;

public class Cofrinho {
	
	private ArrayList<Moeda> listaMoedas; // Lista para armazenar as moedas no cofrinho
	
	public Cofrinho() {
		this.listaMoedas = new ArrayList<>(); // Inicializa a lista de moedas como uma lista vazia
	}
	
	public void adicionar (Moeda moeda) {
		this.listaMoedas.add(moeda); // Adiciona uma moeda na lista de moedas do cofrinho
	}
	
	public void remove (Moeda moeda) {
		this.listaMoedas.remove(moeda); // Remove uma moeda da lista de moedas do cofrinho
	}
	
	public void listagemMoedas() {
		// Verifica se o cofrinho está vazio e imprime uma mensagem escolhida
		if (this.listaMoedas.isEmpty()) {
			System.out.println("Sem moedas no cofrinho :(");
			return; // Retorna sem fazer nada, pois não há moedas para listar
		}
		
		// Percorre a lista de moedas e chama o método "info()" de cada uma para exibir suas informações
		for (Moeda moeda : this.listaMoedas) {
			moeda.info();
		}
	}
	
	public double totalConvertido() {
		// Verifica se o cofrinho está vazio e retorna 0 caso não haja moedas
		if (this.listaMoedas.isEmpty()) {
			return 0;
		}
		double valorAcumulado = 0; // Variável para armazenar o valor total convertido
		
		
		for (Moeda moeda : this.listaMoedas) {
			valorAcumulado = valorAcumulado + moeda.converter();
		}
		return valorAcumulado; // Retorna o valor total acumulado convertido em reais
		
	}
}
