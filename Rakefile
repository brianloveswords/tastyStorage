namespace :build do
  def minified
    require 'net/http'
    require 'uri'
    
    api = URI.parse('http://closure-compiler.appspot.com/')
    api.path = '/compile'
    params = {
      :compilation_level => "ADVANCED_OPTIMIZATIONS",
      :output_format => "text",
      :output_info => "compiled_code",
      :js_code => File.read('./src/tastystorage.js'),
    }
    minified = Net::HTTP.post_form(api, params).body
  end

  task :minify do
    puts minified
  end
  
  task :with_json do
    json2 = File.read('./src/json2.min.js')
    File.open('./build/tastystorage.min.js', 'w') do |f|
      f.puts json2
      f.puts minified
    end
  end

  task :without_json do
    File.open('./build/tastystorage.min.js', 'w') do |f|
      f.puts minified
    end
  end
end

task :default => "build:with_json"
